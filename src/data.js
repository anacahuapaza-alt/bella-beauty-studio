export const services = [
  { id: "corte", name: "Corte y peinado", duration: 45, price: 45, description: "Corte personalizado y acabado con secado." },
  { id: "manicure", name: "Manicure", duration: 40, price: 30, description: "Limpieza, limado y esmaltado tradicional." },
  { id: "pedicure", name: "Pedicure", duration: 50, price: 40, description: "Cuidado de uñas y exfoliación básica." },
  { id: "unas", name: "Uñas acrílicas", duration: 90, price: 85, description: "Aplicación y diseño sencillo." },
  { id: "tinte", name: "Tinte y tratamiento capilar", duration: 120, price: 150, description: "Coloración y tratamiento de hidratación." },
  { id: "maquillaje", name: "Maquillaje social", duration: 60, price: 80, description: "Maquillaje para eventos y ocasiones especiales." }
];

export const stylists = [
  { id: "sofia", name: "Sofía Mendoza", specialty: "Corte y color" },
  { id: "valeria", name: "Valeria Rojas", specialty: "Manicure y uñas" },
  { id: "camila", name: "Camila Torres", specialty: "Maquillaje y peinado" }
];

const today = new Date();
const day = (offset, hour, minute = 0) => {
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const demoAppointments = [
  { id: "demo-1", clientName: "María Torres", email: "maria@example.com", phone: "987 654 321", serviceId: "corte", serviceName: "Corte y peinado", stylistId: "sofia", stylistName: "Sofía Mendoza", dateTime: day(1, 10), status: "confirmada", notes: "Primera visita", demo: true },
  { id: "demo-2", clientName: "Camila Ruiz", email: "camila@example.com", phone: "912 345 678", serviceId: "manicure", serviceName: "Manicure", stylistId: "valeria", stylistName: "Valeria Rojas", dateTime: day(1, 12), status: "pendiente", notes: "Esmaltado nude", demo: true },
  { id: "demo-3", clientName: "Lucía Flores", email: "lucia@example.com", phone: "999 111 222", serviceId: "tinte", serviceName: "Tinte y tratamiento capilar", stylistId: "sofia", stylistName: "Sofía Mendoza", dateTime: day(2, 9), status: "confirmada", notes: "Desea asesoría de color", demo: true },
  { id: "demo-4", clientName: "Andrea Ramos", email: "andrea@example.com", phone: "955 222 333", serviceId: "maquillaje", serviceName: "Maquillaje social", stylistId: "camila", stylistName: "Camila Torres", dateTime: day(2, 15), status: "cancelada", notes: "", demo: true },
  { id: "demo-5", clientName: "Daniela Paredes", email: "daniela@example.com", phone: "944 333 222", serviceId: "unas", serviceName: "Uñas acrílicas", stylistId: "valeria", stylistName: "Valeria Rojas", dateTime: day(3, 11), status: "pendiente", notes: "Diseño francés", demo: true }
];
