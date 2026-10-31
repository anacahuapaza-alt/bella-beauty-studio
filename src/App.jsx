import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, Users, CheckCircle2, XCircle, Plus, Search, Video, CalendarCheck, Sparkles, Menu, X, ArrowUpRight } from "lucide-react";
import { services, stylists, demoAppointments } from "./data";
import { firebaseReady } from "./firebase";
import { listAppointments, createAppointment, changeStatus } from "./store";

const money = n => new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN" }).format(n);
const prettyDate = value => new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
const dateInput = d => { const x = new Date(d); return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`; };
const today = dateInput(new Date());

export default function App() {
  const [appointments, setAppointments] = useState(demoAppointments);
  const [tab, setTab] = useState("panel");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [form, setForm] = useState({ clientName:"", email:"", phone:"", serviceId:"corte", stylistId:"sofia", date:today, time:"09:00", notes:"" });

  async function refresh() {
    try { setAppointments(await listAppointments()); }
    catch { setNotice("No se pudo cargar Firebase. Revisa la configuración."); }
  }
  useEffect(() => { refresh(); }, []);

  const selectedService = services.find(s => s.id === form.serviceId) || services[0];
  const filtered = useMemo(() => appointments.filter(a => `${a.clientName} ${a.email} ${a.phone}`.toLowerCase().includes(search.toLowerCase())), [appointments, search]);
  const active = appointments.filter(a => a.status !== "cancelada");
  const pending = appointments.filter(a => a.status === "pendiente").length;
  const confirmed = appointments.filter(a => a.status === "confirmada").length;

  async function submitBooking(e) {
    e.preventDefault(); setNotice("");
    if (new Date(`${form.date}T${form.time}:00`) <= new Date()) return setNotice("Selecciona una fecha y hora futuras.");
    setLoading(true);
    try {
      const service = services.find(s => s.id === form.serviceId);
      await createAppointment({
        clientName: form.clientName.trim(), email: form.email.trim(), phone: form.phone.trim(),
        serviceId: service.id, serviceName: service.name, stylistId: form.stylistId, stylistName: stylists.find(x => x.id === form.stylistId)?.name || "Por asignar", durationMinutes: service.duration, dateTime: new Date(`${form.date}T${form.time}:00`).toISOString(),
        notes: form.notes.trim()
      });
      setNotice("¡Tu solicitud de cita fue registrada! El administrador la confirmará.");
      setForm(f => ({ ...f, clientName:"", email:"", phone:"", notes:"" }));
      await refresh();
    } catch (err) { setNotice(err.message || "No se pudo registrar la cita."); }
    finally { setLoading(false); }
  }

  async function status(id, value) {
    try { await changeStatus(id, value); await refresh(); }
    catch { setNotice("No se pudo actualizar la cita."); }
  }

  const nav = [
    ["panel", "Resumen", CalendarDays],
    ["citas", "Citas", CalendarCheck],
    ["reservar", "Nueva reserva", Plus]
  ];
  return <div className="app-shell">
    <aside className={`sidebar ${mobileMenu ? "show" : ""}`}>
      <div className="brand"><div className="brand-mark"><CalendarCheck size={21}/></div><div><b>bella<span>.</span></b><small>BEAUTY STUDIO</small></div><button className="mobile-close" onClick={()=>setMobileMenu(false)}><X/></button></div>
      <div className="workspace"><span className="avatar">BS</span><div><b>Bella Beauty Studio</b><small>Salón de belleza</small></div><span className="online-dot"/></div>
      <p className="nav-label">MENÚ PRINCIPAL</p>
      <nav>{nav.map(([id,label,Icon])=><button key={id} className={`nav-item ${tab===id?"selected":""}`} onClick={()=>{setTab(id);setMobileMenu(false)}}><Icon size={18}/>{label}{id==="citas"&&<span className="nav-count">{appointments.length}</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><Sparkles size={17}/><b>Tu salón, siempre en orden</b><p>Administra reservas, clientas y especialistas desde un solo lugar.</p></div><div className="profile"><div className="avatar admin">AD</div><div><b>Administrador</b><small>admin@turno-demo.com</small></div></div></div>
    </aside>
    {mobileMenu && <div className="scrim" onClick={()=>setMobileMenu(false)}/>}
    <main className="main">
      <header className="topbar"><button className="mobile-toggle" onClick={()=>setMobileMenu(true)}><Menu/></button><div className="breadcrumb">Workspace <span>/</span> {nav.find(n=>n[0]===tab)?.[1]}</div><div className="top-actions"><span className={`connection ${firebaseReady?"live":"demo"}`}><i/>{firebaseReady?"Firebase conectado":"Modo demostración"}</span><div className="avatar admin">AD</div></div></header>
      <div className="content">
        {notice && <div className="notice"><span>{notice}</span><button onClick={()=>setNotice("")}><X size={16}/></button></div>}
        {tab==="panel" && <><div className="page-heading"><div><p className="eyebrow">VISTA GENERAL</p><h1>¡Hola, bienvenida! <span>✦</span></h1><p className="subheading">Este es el resumen de tu salón de belleza.</p></div><button className="primary-btn" onClick={()=>setTab("reservar")}><Plus size={17}/> Nueva cita</button></div>
          <div className="stats-grid">
            <Stat icon={CalendarDays} label="Total de citas" value={appointments.length} hint="Reservas registradas" tone="purple"/>
            <Stat icon={Clock3} label="Pendientes" value={pending} hint="Esperan confirmación" tone="orange"/>
            <Stat icon={CheckCircle2} label="Confirmadas" value={confirmed} hint="Citas confirmadas" tone="green"/>
            <Stat icon={Users} label="Clientes activos" value={new Set(active.map(a=>a.email)).size} hint="Con citas no canceladas" tone="blue"/>
          </div>
          <section className="panel-card"><div className="section-head"><div><h2>Citas recientes</h2><p>Revisa las próximas reservas de tus clientes.</p></div><button className="text-btn" onClick={()=>setTab("citas")}>Ver todas <ArrowUpRight size={15}/></button></div><AppointmentTable items={[...appointments].sort((a,b)=>a.dateTime.localeCompare(b.dateTime)).slice(0,5)} onStatus={status}/></section>
          <div className="bottom-grid"><section className="panel-card"><div className="section-head"><div><h2>Servicios del salón</h2><p>Tratamientos disponibles para reservar.</p></div></div>{services.map(s=><div className="service-row" key={s.id}><div className="service-icon"><Video size={18}/></div><div className="service-info"><b>{s.name}</b><small>{s.duration} minutos</small></div><strong>{money(s.price)}</strong></div>)}</section><section className="panel-card tip-card"><div className="tip-icon"><Sparkles/></div><h2>Tu agenda, más simple</h2><p>Comparte tu página de reservas para que tus clientes soliciten una cita en cualquier momento.</p><button className="outline-btn" onClick={()=>setTab("reservar")}>Abrir reservas <ArrowUpRight size={15}/></button></section></div>
        </>}
        {tab==="citas" && <><div className="page-heading"><div><p className="eyebrow">AGENDA</p><h1>Todas las citas</h1><p className="subheading">Administra y actualiza el estado de las reservas.</p></div><button className="primary-btn" onClick={()=>setTab("reservar")}><Plus size={17}/> Nueva cita</button></div><section className="panel-card"><div className="toolbar"><div><h2>Listado de reservas</h2><p>{appointments.length} registros en total</p></div><div className="searchbox"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar cliente..."/></div></div><AppointmentTable items={filtered} onStatus={status}/></section></>}
        {tab==="reservar" && <><div className="page-heading"><div><p className="eyebrow">RESERVACIONES</p><h1>Reserva tu momento</h1><p className="subheading">Elige tu servicio de belleza, especialista y horario.</p></div></div><div className="booking-layout"><section className="panel-card booking-card"><form onSubmit={submitBooking}><div className="form-section-title"><span>01</span><div><b>Datos personales</b><small>Cuéntanos cómo podemos contactarte.</small></div></div><div className="form-grid"><Field label="Nombre completo"><input required value={form.clientName} onChange={e=>setForm({...form,clientName:e.target.value})} placeholder="Ej. Ana Pérez"/></Field><Field label="Correo electrónico"><input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="ana@correo.com"/></Field><Field label="Teléfono"><input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="987 654 321"/></Field></div><div className="form-section-title separated"><span>02</span><div><b>Elige tu servicio</b><small>Selecciona el tipo de atención.</small></div></div><div className="service-options">{services.map(s=><button type="button" key={s.id} className={`service-option ${form.serviceId===s.id?"chosen":""}`} onClick={()=>setForm({...form,serviceId:s.id})}><span className="radio-dot"/><div><b>{s.name}</b><small>{s.duration} min · {s.description}</small></div><strong>{money(s.price)}</strong></button>)}</div><div className="form-section-title separated"><span>03</span><div><b>Elige a tu especialista</b><small>Selecciona quién te atenderá.</small></div></div><Field label="Especialista"><select value={form.stylistId} onChange={e=>setForm({...form,stylistId:e.target.value})}>{stylists.map(p=><option key={p.id} value={p.id}>{p.name} · {p.specialty}</option>)}</select></Field><div className="form-section-title separated"><span>04</span><div><b>Fecha y horario</b><small>Elige cuándo deseas tu cita.</small></div></div><div className="form-grid"><Field label="Fecha"><input type="date" min={today} required value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></Field><Field label="Hora"><select value={form.time} onChange={e=>setForm({...form,time:e.target.value})}>{["09:00","10:00","11:00","12:00","14:00","15:00","16:00","17:00"].map(t=><option key={t}>{t}</option>)}</select></Field></div><Field label="Notas (opcional)"><textarea rows="3" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Escribe algún detalle que debamos conocer..."/></Field><button className="primary-btn submit-btn" disabled={loading}>{loading?"Registrando...":"Solicitar cita"} <ArrowUpRight size={17}/></button><p className="form-footnote">Tu reserva quedará pendiente hasta que el salón confirme la disponibilidad.</p></form></section><aside className="booking-aside"><div className="aside-illustration"><CalendarCheck size={42}/><span>Tu tiempo importa</span></div><h3>Un momento para ti</h3><p>Elige tu tratamiento, especialista, fecha y horario. El salón confirmará tu reserva.</p><div className="aside-line"><CheckCircle2/> Registro sencillo</div><div className="aside-line"><CheckCircle2/> Atención personalizada</div><div className="aside-line"><CheckCircle2/> Horarios organizados</div></aside></div></>}
        <footer>© 2026 Bella Beauty Studio · Sistema de reservas <span>Hecho para organizar mejor tu tiempo.</span></footer>
      </div>
    </main>
  </div>;
}

function Stat({icon:Icon,label,value,hint,tone}) { return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={19}/></div><p>{label}</p><strong>{value}</strong><small>{hint}</small></div>; }
function Field({label,children}) { return <label className="field"><span>{label}</span>{children}</label>; }
function AppointmentTable({items,onStatus}) {
  if (!items.length) return <div className="empty-state"><CalendarDays size={28}/><b>No hay citas para mostrar</b><span>Cuando se registren reservas aparecerán aquí.</span></div>;
  return <div className="table-wrap"><table><thead><tr><th>CLIENTE</th><th>SERVICIO</th><th>ESPECIALISTA</th><th>FECHA Y HORA</th><th>ESTADO</th><th>ACCIÓN</th></tr></thead><tbody>{items.map(a=><tr key={a.id}><td><div className="client-cell"><span className="client-avatar">{a.clientName.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase()}</span><div><b>{a.clientName}</b><small>{a.email}</small></div></div></td><td>{a.serviceName}</td><td>{a.stylistName || "Por asignar"}</td><td>{prettyDate(a.dateTime)}</td><td><span className={`status ${a.status}`}>{a.status}</span></td><td><select className="status-select" value={a.status} onChange={e=>onStatus(a.id,e.target.value)} aria-label={`Cambiar estado de ${a.clientName}`}><option value="pendiente">Pendiente</option><option value="confirmada">Confirmada</option><option value="completada">Completada</option><option value="cancelada">Cancelada</option></select></td></tr>)}</tbody></table></div>;
}
