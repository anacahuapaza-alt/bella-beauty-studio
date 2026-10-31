import { addDoc, collection, getDocs, orderBy, query, updateDoc, doc, where } from "firebase/firestore";
import { db, firebaseReady } from "./firebase";
import { demoAppointments, services } from "./data";

const KEY = "bella-beauty-studio-appointments";
const readLocal = () => {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : demoAppointments;
  } catch { return demoAppointments; }
};
const writeLocal = (items) => localStorage.setItem(KEY, JSON.stringify(items));

const durationOf = (appointment) =>
  Number(appointment.durationMinutes || services.find(s => s.id === appointment.serviceId)?.duration || 30);

function hasStylistConflict(existing, incoming) {
  if (existing.status === "cancelada" || existing.stylistId !== incoming.stylistId) return false;
  const startA = new Date(existing.dateTime).getTime();
  const endA = startA + durationOf(existing) * 60_000;
  const startB = new Date(incoming.dateTime).getTime();
  const endB = startB + durationOf(incoming) * 60_000;
  return startA < endB && startB < endA;
}

export async function listAppointments() {
  if (!firebaseReady) return readLocal().sort((a,b) => a.dateTime.localeCompare(b.dateTime));
  const q = query(collection(db, "appointments"), orderBy("dateTime", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createAppointment(payload) {
  const incoming = { ...payload, status: "pendiente" };
  if (!firebaseReady) {
    const items = readLocal();
    if (items.some(a => hasStylistConflict(a, incoming))) {
      throw new Error("La especialista ya tiene una cita en ese horario. Elige otra hora o especialista.");
    }
    const item = { ...incoming, id: crypto.randomUUID(), createdAt: new Date().toISOString(), demo: true };
    writeLocal([...items, item]);
    return item;
  }

  const byStylist = query(collection(db, "appointments"), where("stylistId", "==", payload.stylistId));
  const snap = await getDocs(byStylist);
  const existing = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  if (existing.some(a => hasStylistConflict(a, incoming))) {
    throw new Error("La especialista ya tiene una cita en ese horario. Elige otra hora o especialista.");
  }
  const ref = await addDoc(collection(db, "appointments"), { ...incoming, createdAt: new Date().toISOString() });
  return { id: ref.id, ...incoming };
}

export async function changeStatus(id, status) {
  if (!firebaseReady) {
    writeLocal(readLocal().map(a => a.id === id ? { ...a, status } : a));
    return;
  }
  await updateDoc(doc(db, "appointments", id), { status, updatedAt: new Date().toISOString() });
}
