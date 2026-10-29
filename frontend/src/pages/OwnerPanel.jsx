import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck, Users, CarFront, MessageCircle, RefreshCw, Trash2, LogOut,
  LayoutDashboard, Search, Pencil, X, Save, ExternalLink, AlertTriangle
} from "lucide-react";

const API = "https://vehicle-hub-h35a.vercel.app/api";
const OWNER_EMAIL = "emanahmad12789@gmail.com";

const inputClass = "w-full rounded-xl border border-[#D8CEC1] bg-white px-3 py-2.5 text-sm text-[#26352D] outline-none focus:border-[#B86F52] focus:ring-2 focus:ring-[#B86F52]/15";
const buttonClass = "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export default function OwnerPanel() {
  const navigate = useNavigate();
  const [section, setSection] = useState("overview");
  const [stats, setStats] = useState({ users: 0, vehicles: 0, messages: 0, cars: 0, bikes: 0 });
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({});

  const getToken = () => localStorage.getItem("vehicleHubToken") || "";
  const getSavedUser = () => {
    try { return JSON.parse(localStorage.getItem("vehicleHubLoggedIn") || "null"); }
    catch { return null; }
  };

  const request = useCallback(async (path, options = {}) => {
    const response = await fetch(`${API}/admin${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
        ...(options.headers || {})
      }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
    return data;
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [overview, userData, vehicleData, messageData] = await Promise.all([
        request("/overview"), request("/users"), request("/vehicles"), request("/messages")
      ]);
      setStats(overview.stats || {});
      setUsers(userData.users || []);
      setVehicles(vehicleData.vehicles || []);
      setMessages(messageData.messages || []);
    } catch (e) {
      setError(e.message || "Could not load owner panel.");
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    const user = getSavedUser();
    if (!getToken() || String(user?.email || "").toLowerCase() !== OWNER_EMAIL) {
      navigate("/login", { replace: true, state: { from: "/owner" } });
      return;
    }
    loadData();
  }, [navigate, loadData]);

  const filteredUsers = useMemo(() => users.filter(u =>
    [u.name, u.email, u.phone, u.city, u.status].some(v => String(v || "").toLowerCase().includes(search.toLowerCase()))
  ), [users, search]);
  const filteredVehicles = useMemo(() => vehicles.filter(v =>
    [v.title, v.name, v.brand, v.model, v.type, v.city, v.sellerName, v.sellerEmail].some(x => String(x || "").toLowerCase().includes(search.toLowerCase()))
  ), [vehicles, search]);
  const filteredMessages = useMemo(() => messages.filter(m =>
    [m.fromName, m.fromEmail, m.toName, m.toEmail, m.vehicleTitle, m.text].some(x => String(x || "").toLowerCase().includes(search.toLowerCase()))
  ), [messages, search]);

  const removeVehicle = async (vehicle) => {
    if (!window.confirm(`Delete "${vehicle.title || vehicle.name || "this listing"}" permanently?`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await request(`/vehicles/${vehicle._id}`, { method: "DELETE" });
      setNotice("Vehicle listing deleted."); await loadData();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const removeUser = async (user) => {
    if (!window.confirm(`Delete ${user.name} (${user.email}) and their listings/messages? This cannot be undone.`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await request(`/users/${user._id}`, { method: "DELETE" });
      setNotice("User and associated listings/messages deleted."); await loadData();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const toggleUserStatus = async (user) => {
    const nextStatus = user.status === "suspended" ? "active" : "suspended";
    if (!window.confirm(`Are you sure you want to ${nextStatus === "suspended" ? "suspend" : "reactivate"} ${user.name || user.email}?`)) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await request(`/users/${user._id}/status`, { method: "PATCH", body: JSON.stringify({ status: nextStatus }) });
      setNotice(nextStatus === "suspended" ? "User suspended." : "User reactivated."); await loadData();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const startEditVehicle = (v) => {
    setEditing({ type: "vehicle", id: v._id });
    setDraft({
      title: v.title || v.name || "", type: v.type || "Car", brand: v.brand || v.make || "",
      model: v.model || "", year: v.year || "", price: v.price ?? "", condition: v.condition || "Used",
      city: v.city || v.location || "", mileage: v.mileage || "", fuel: v.fuel || "Petrol",
      transmission: v.transmission || "Manual", color: v.color || "", image: v.image || v.imageUrl || "",
      description: v.description || ""
    });
    setError(""); setNotice("");
  };

  const startEditUser = (u) => {
    setEditing({ type: "user", id: u._id });
    setDraft({ name: u.name || "", phone: u.phone || "", city: u.city || "" });
    setError(""); setNotice("");
  };

  const saveEdit = async (event) => {
    event.preventDefault();
    if (!editing) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const path = editing.type === "vehicle" ? `/vehicles/${editing.id}` : `/users/${editing.id}`;
      await request(path, { method: "PATCH", body: JSON.stringify(draft) });
      setNotice(editing.type === "vehicle" ? "Vehicle listing updated." : "User details updated.");
      setEditing(null); await loadData();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const removeMessage = async (message) => {
    if (!window.confirm("Permanently delete this message?")) return;
    setBusy(true); setError(""); setNotice("");
    try {
      await request(`/messages/${message._id}`, { method: "DELETE" });
      setNotice("Message deleted."); await loadData();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  };

  const nav = [
    ["overview", "Overview", LayoutDashboard, stats.users + stats.vehicles],
    ["vehicles", "Vehicle listings", CarFront, stats.vehicles],
    ["users", "Users", Users, stats.users],
    ["messages", "Messages", MessageCircle, stats.messages]
  ];

  const card = (label, value, Icon, onClick) => (
    <button key={label} onClick={onClick} className="rounded-2xl border border-[#D8CEC1] bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between"><p className="text-sm text-[#77736B]">{label}</p><Icon size={21} className="text-[#B86F52]" /></div>
      <p className="mt-3 text-3xl font-bold text-[#26352D]">{value ?? 0}</p>
      <p className="mt-2 text-xs text-[#77736B]">Manage <span aria-hidden="true">→</span></p>
    </button>
  );

  const field = (label, key, type = "text", options = null) => (
    <label key={key} className="block space-y-1.5">
      <span className="text-sm font-semibold text-[#26352D]">{label}</span>
      {options ? <select className={inputClass} value={draft[key] ?? ""} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}>
        {options.map(option => <option key={option} value={option}>{option}</option>)}
      </select> : type === "textarea" ? <textarea className={inputClass} rows={4} value={draft[key] ?? ""} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} /> :
        <input className={inputClass} type={type} min={type === "number" ? "0" : undefined} value={draft[key] ?? ""} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))} />}
    </label>
  );

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#26352D]">
      <header className="bg-[#26352D] text-white shadow-md">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-3"><ShieldCheck size={26} /></div>
            <div><h1 className="text-xl font-bold sm:text-2xl">VehicleHub Owner Panel</h1><p className="text-sm text-white/70">Private marketplace control centre</p></div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button disabled={loading || busy} onClick={loadData} className={`${buttonClass} border border-white/20 text-white hover:bg-white/10`}><RefreshCw size={16} /> Refresh</button>
            <Link to="/" className={`${buttonClass} bg-white/10 text-white hover:bg-white/20`}><ExternalLink size={16} /> View website</Link>
            <button onClick={() => { localStorage.removeItem("vehicleHubToken"); localStorage.removeItem("vehicleHubLoggedIn"); navigate("/login"); }} className={`${buttonClass} bg-[#B86F52] text-white hover:opacity-90`}><LogOut size={16} /> Log out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-[#D8CEC1] bg-[#FFFCF7] p-3 lg:sticky lg:top-4">
          <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#8A857B]">Administration</p>
          {nav.map(([key, label, Icon, count]) => <button key={key} onClick={() => { setSection(key); setSearch(""); setError(""); setNotice(""); }} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${section === key ? "bg-[#26352D] text-white" : "hover:bg-[#F0E9DF]"}`}><Icon size={18} /><span className="flex-1">{label}</span>{key !== "overview" && <span className={`rounded-full px-2 py-0.5 text-xs ${section === key ? "bg-white/15" : "bg-[#E9E4DA]"}`}>{count}</span>}</button>)}
          <div className="my-3 border-t border-[#E6DED3]" />
          <div className="rounded-xl bg-[#F0E9DF] p-3"><p className="text-xs text-[#77736B]">OWNER ACCOUNT</p><p className="mt-1 break-all text-sm font-semibold">{OWNER_EMAIL}</p><p className="mt-2 flex items-center gap-1 text-xs text-green-700"><ShieldCheck size={14} /> Protected admin access</p></div>
          <Link to="/" className="mt-3 block rounded-xl px-3 py-3 text-sm text-[#77736B] hover:bg-[#F0E9DF]">← Back to website</Link>
        </aside>

        <section className="min-w-0">
          {error && <div role="alert" className="mb-4 flex gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"><AlertTriangle size={18} className="shrink-0" />{error}</div>}
          {notice && <div role="status" className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{notice}</div>}

          {section !== "overview" && <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-2xl font-bold">{section === "vehicles" ? "Vehicle listings" : section === "users" ? "Registered users" : "Marketplace messages"}</h2><p className="mt-1 text-sm text-[#77736B]">Search and manage records stored in your database.</p></div>
            <label className="relative block sm:w-80"><Search size={17} className="absolute left-3 top-3 text-[#77736B]" /><input className={`${inputClass} pl-9`} placeholder={`Search ${section}...`} value={search} onChange={e => setSearch(e.target.value)} /></label>
          </div>}

          {loading ? <div className="rounded-2xl border border-[#D8CEC1] bg-white p-10 text-center">Loading owner dashboard…</div> : <>
            {section === "overview" && <>
              <div className="mb-5"><h2 className="text-2xl font-bold sm:text-3xl">Dashboard overview</h2><p className="mt-1 text-sm text-[#77736B]">Monitor and manage your marketplace from one secure place.</p></div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {card("Registered users", stats.users, Users, () => setSection("users"))}
                {card("All vehicle listings", stats.vehicles, CarFront, () => setSection("vehicles"))}
                {card("Cars", stats.cars, CarFront, () => { setSection("vehicles"); setSearch("Car"); })}
                {card("Bikes", stats.bikes, CarFront, () => { setSection("vehicles"); setSearch("Bike"); })}
                {card("Messages", stats.messages, MessageCircle, () => setSection("messages"))}
              </div>
              <div className="mt-6 grid gap-4 xl:grid-cols-2">
                <div className="rounded-2xl border border-[#D8CEC1] bg-[#FFFCF7] p-5"><h3 className="font-bold">Available controls</h3><ul className="mt-3 space-y-2 text-sm text-[#77736B]"><li>• Edit listing title, price, details, image and description.</li><li>• Review users, update their contact details and suspend/reactivate accounts.</li><li>• Delete inappropriate listings, messages, or accounts.</li><li>• Refresh totals directly from the database.</li></ul></div>
                <div className="rounded-2xl border border-[#D8CEC1] bg-white p-5"><h3 className="font-bold">Quick actions</h3><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => setSection("vehicles")} className={`${buttonClass} bg-[#26352D] text-white`}><CarFront size={16}/> Manage listings</button><button onClick={() => setSection("users")} className={`${buttonClass} border border-[#D8CEC1]`}><Users size={16}/> Manage users</button><button onClick={() => setSection("messages")} className={`${buttonClass} border border-[#D8CEC1]`}><MessageCircle size={16}/> View messages</button></div></div>
              </div>
            </>}

            {section === "vehicles" && <div className="overflow-x-auto rounded-2xl border border-[#D8CEC1] bg-white shadow-sm"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#E9E4DA]"><tr>{["Vehicle","Type","Price","City","Seller","Date","Actions"].map(x=><th key={x} className="px-4 py-3 font-bold">{x}</th>)}</tr></thead><tbody>{filteredVehicles.map(v=><tr key={v._id} className="border-t border-[#eee7de] hover:bg-[#FFFCF7]"><td className="px-4 py-3"><div className="flex items-center gap-3">{(v.image || v.imageUrl) && <img src={v.image || v.imageUrl} alt="" className="h-12 w-16 rounded-lg object-cover" onError={e => { e.currentTarget.style.display = "none"; }} />}<div><p className="font-semibold">{v.title || v.name || [v.brand,v.model].filter(Boolean).join(" ") || "Untitled"}</p><p className="text-xs text-[#77736B]">{v.year || "Year not set"} · {v.condition || "Condition not set"}</p></div></div></td><td className="px-4 py-3">{v.type || "—"}</td><td className="px-4 py-3 font-semibold">Rs {Number(v.price || 0).toLocaleString()}</td><td className="px-4 py-3">{v.city || v.location || "—"}</td><td className="px-4 py-3"><p>{v.sellerName || "—"}</p><p className="text-xs text-[#77736B]">{v.sellerEmail || v.email || ""}</p></td><td className="px-4 py-3">{v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "—"}</td><td className="px-4 py-3"><div className="flex gap-2"><button disabled={busy} onClick={() => startEditVehicle(v)} className={`${buttonClass} bg-[#F0E9DF]`}><Pencil size={15}/> Edit</button><button disabled={busy} onClick={() => removeVehicle(v)} className={`${buttonClass} bg-red-50 text-red-700 hover:bg-red-100`}><Trash2 size={15}/> Delete</button></div></td></tr>)}</tbody></table>{filteredVehicles.length===0&&<p className="p-8 text-center text-[#77736B]">No matching vehicle listings.</p>}</div>}

            {section === "users" && <div className="overflow-x-auto rounded-2xl border border-[#D8CEC1] bg-white shadow-sm"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-[#E9E4DA]"><tr>{["User","Phone","City","Status","Joined","Controls"].map(x=><th key={x} className="px-4 py-3 font-bold">{x}</th>)}</tr></thead><tbody>{filteredUsers.map(u=><tr key={u._id} className="border-t border-[#eee7de] hover:bg-[#FFFCF7]"><td className="px-4 py-3"><p className="font-semibold">{u.name} {u.email?.toLowerCase()===OWNER_EMAIL&&<span className="ml-1 rounded-full bg-[#E9E4DA] px-2 py-1 text-xs">OWNER</span>}</p><p className="text-xs text-[#77736B]">{u.email}</p></td><td className="px-4 py-3">{u.phone || "—"}</td><td className="px-4 py-3">{u.city || "—"}</td><td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${u.status==="suspended"?"bg-red-100 text-red-700":"bg-green-100 text-green-700"}`}>{u.status || "active"}</span></td><td className="px-4 py-3">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td><td className="px-4 py-3">{u.email?.toLowerCase()===OWNER_EMAIL?<span className="text-xs text-[#77736B]">Owner protected</span>:<div className="flex flex-wrap gap-2"><button disabled={busy} onClick={()=>startEditUser(u)} className={`${buttonClass} bg-[#F0E9DF]`}><Pencil size={15}/> Edit</button><button disabled={busy} onClick={()=>toggleUserStatus(u)} className={`${buttonClass} ${u.status==="suspended"?"bg-green-50 text-green-700":"bg-amber-50 text-amber-800"}`}>{u.status==="suspended"?"Reactivate":"Suspend"}</button><button disabled={busy} onClick={()=>removeUser(u)} className={`${buttonClass} bg-red-50 text-red-700 hover:bg-red-100`}><Trash2 size={15}/> Delete</button></div>}</td></tr>)}</tbody></table>{filteredUsers.length===0&&<p className="p-8 text-center text-[#77736B]">No matching users.</p>}</div>}

            {section === "messages" && <div className="grid gap-3">{filteredMessages.map(m=><article key={m._id} className="rounded-2xl border border-[#D8CEC1] bg-white p-4 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><p className="break-words font-semibold">{m.fromName || m.fromEmail} <span className="font-normal text-[#77736B]">→ {m.toName || m.toEmail}</span></p><p className="mt-1 break-all text-xs text-[#77736B]">{m.fromEmail} → {m.toEmail}</p></div><div className="flex items-center gap-3"><time className="text-xs text-[#77736B]">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}</time><button disabled={busy} onClick={()=>removeMessage(m)} className={`${buttonClass} bg-red-50 text-red-700 hover:bg-red-100`}><Trash2 size={15}/> Delete</button></div></div>{m.vehicleTitle&&<p className="mt-3 text-xs font-semibold text-[#B86F52]">Vehicle: {m.vehicleTitle}</p>}<p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6">{m.text}</p></article>)}{filteredMessages.length===0&&<p className="rounded-2xl border border-[#D8CEC1] bg-white p-8 text-center text-[#77736B]">No matching messages.</p>}</div>}
          </>}
        </section>
      </main>

      {editing && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6" onMouseDown={e => { if (e.target === e.currentTarget && !busy) setEditing(null); }}>
        <div role="dialog" aria-modal="true" aria-labelledby="edit-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-[#FFFCF7] p-5 shadow-2xl sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-3"><div><h2 id="edit-title" className="text-xl font-bold">{editing.type==="vehicle"?"Edit vehicle listing":"Edit user details"}</h2><p className="mt-1 text-sm text-[#77736B]">Changes save directly to the VehicleHub database.</p></div><button disabled={busy} onClick={()=>setEditing(null)} className="rounded-lg p-2 hover:bg-[#F0E9DF]" aria-label="Close editor"><X size={20}/></button></div>
          <form onSubmit={saveEdit} className="space-y-4">
            {editing.type==="vehicle" ? <>
              <div className="grid gap-4 sm:grid-cols-2">{field("Listing title *","title")}{field("Vehicle type","type","text",["Car","Bike"])}{field("Brand / make","brand")}{field("Model","model")}{field("Year","year","number")}{field("Price (PKR) *","price","number")}{field("Condition","condition","text",["New","Used","Certified"])}{field("City","city")}{field("Mileage","mileage")}{field("Fuel","fuel","text",["Petrol","Diesel","Hybrid","Electric","CNG","Other"])}{field("Transmission","transmission","text",["Manual","Automatic","Other"])}{field("Color","color")}</div>
              {field("Image URL","image")}{field("Description","description","textarea")}
            </> : <div className="grid gap-4 sm:grid-cols-2">{field("Full name *","name")}{field("Phone","phone")}{field("City","city")}</div>}
            <div className="flex flex-wrap justify-end gap-2 border-t border-[#E6DED3] pt-4"><button type="button" disabled={busy} onClick={()=>setEditing(null)} className={`${buttonClass} border border-[#D8CEC1]`}>Cancel</button><button type="submit" disabled={busy} className={`${buttonClass} bg-[#26352D] text-white hover:bg-[#35483D]`}><Save size={16}/>{busy?"Saving…":"Save changes"}</button></div>
          </form>
        </div>
      </div>}
    </div>
  );
}
