import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Users, CarFront, MessageCircle, RefreshCw, Trash2, LogOut, LayoutDashboard } from "lucide-react";

const API = "https://vehicle-hub-h35a.vercel.app/api";
const OWNER_EMAIL = "emanahmad12789@gmail.com";

export default function OwnerPanel() {
  const navigate = useNavigate();
  const [section, setSection] = useState("overview");
  const [stats, setStats] = useState({ users: 0, vehicles: 0, messages: 0, cars: 0, bikes: 0 });
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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

  const removeVehicle = async (vehicle) => {
    if (!window.confirm(`Delete "${vehicle.title || vehicle.name || "this listing"}" permanently?`)) return;
    try {
      await request(`/vehicles/${vehicle._id}`, { method: "DELETE" });
      setNotice("Vehicle listing deleted.");
      await loadData();
    } catch (e) { setError(e.message); }
  };

  const removeUser = async (user) => {
    if (!window.confirm(`Delete ${user.name} (${user.email}) and their listings/messages? This cannot be undone.`)) return;
    try {
      await request(`/users/${user._id}`, { method: "DELETE" });
      setNotice("User and associated listings/messages deleted.");
      await loadData();
    } catch (e) { setError(e.message); }
  };

  const toggleUserStatus = async (user) => {
    const nextStatus = user.status === "suspended" ? "active" : "suspended";
    const action = nextStatus === "suspended" ? "suspend" : "reactivate";
    if (!window.confirm(`Are you sure you want to ${action} ${user.name || user.email}?`)) return;
    try {
      await request(`/users/${user._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus })
      });
      setNotice(nextStatus === "suspended" ? "User suspended. They can no longer log in or use protected features." : "User reactivated.");
      await loadData();
    } catch (e) { setError(e.message); }
  };

  const nav = [
    ["overview", "Overview", LayoutDashboard],
    ["vehicles", "Vehicle listings", CarFront],
    ["users", "Users", Users],
    ["messages", "Messages", MessageCircle]
  ];

  const card = (label, value, Icon) => (
    <div key={label} className="rounded-2xl border border-[#D8CEC1] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#77736B]">{label}</p>
        <Icon size={20} className="text-[#B86F52]" />
      </div>
      <p className="mt-3 text-3xl font-bold text-[#26352D]">{value ?? 0}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F3EC] text-[#26352D]">
      <header className="bg-[#26352D] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 p-3"><ShieldCheck size={25} /></div>
            <div><h1 className="text-xl font-bold">VehicleHub Owner Panel</h1><p className="text-sm text-white/70">Signed in as {OWNER_EMAIL}</p></div>
          </div>
          <div className="flex gap-2">
            <button onClick={loadData} className="flex items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10"><RefreshCw size={16} /> Refresh</button>
            <button onClick={() => { localStorage.removeItem("vehicleHubToken"); localStorage.removeItem("vehicleHubLoggedIn"); navigate("/login"); }} className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm hover:bg-white/20"><LogOut size={16} /> Log out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-7 sm:px-6 lg:grid-cols-[230px_1fr]">
        <aside className="h-fit rounded-2xl border border-[#D8CEC1] bg-[#FFFCF7] p-3">
          <p className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#8A857B]">Administration</p>
          {nav.map(([key, label, Icon]) => <button key={key} onClick={() => { setSection(key); setError(""); setNotice(""); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${section === key ? "bg-[#26352D] text-white" : "hover:bg-[#F0E9DF]"}`}><Icon size={18} />{label}</button>)}
          <Link to="/" className="mt-3 block rounded-xl px-3 py-3 text-sm text-[#77736B] hover:bg-[#F0E9DF]">← Back to website</Link>
        </aside>

        <section className="min-w-0">
          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
          {notice && <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{notice}</div>}
          {loading ? <div className="rounded-2xl bg-white p-10 text-center">Loading owner dashboard…</div> : <>
            {section === "overview" && <>
              <div className="mb-5"><h2 className="text-2xl font-bold">Dashboard overview</h2><p className="mt-1 text-sm text-[#77736B]">Manage your marketplace from one place.</p></div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{card("Registered users", stats.users, Users)}{card("All listings", stats.vehicles, CarFront)}{card("Cars", stats.cars, CarFront)}{card("Bikes", stats.bikes, CarFront)}{card("Messages", stats.messages, MessageCircle)}</div>
              <div className="mt-6 rounded-2xl border border-[#D8CEC1] bg-[#FFFCF7] p-5"><h3 className="font-bold">Owner controls</h3><p className="mt-2 text-sm leading-6 text-[#77736B]">Review all published vehicles, inspect registered accounts and view messages. Deleting a user also removes their listings and messages. These actions are protected by the backend owner check.</p></div>
            </>}
            {section === "vehicles" && <><h2 className="mb-4 text-2xl font-bold">Vehicle listings ({vehicles.length})</h2><div className="overflow-x-auto rounded-2xl border border-[#D8CEC1] bg-white"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-[#E9E4DA]"><tr>{["Vehicle","Type","Price","Seller","Date","Action"].map(x=><th key={x} className="px-4 py-3">{x}</th>)}</tr></thead><tbody>{vehicles.map(v=><tr key={v._id} className="border-t border-[#eee7de]"><td className="px-4 py-3 font-semibold">{v.title || v.name || [v.brand,v.model].filter(Boolean).join(" ") || "Untitled"}</td><td className="px-4 py-3">{v.type || "—"}</td><td className="px-4 py-3">Rs {Number(v.price || 0).toLocaleString()}</td><td className="px-4 py-3">{v.sellerEmail || v.email || "—"}</td><td className="px-4 py-3">{v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "—"}</td><td className="px-4 py-3"><button onClick={()=>removeVehicle(v)} className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100"><Trash2 size={15}/> Delete</button></td></tr>)}</tbody></table>{vehicles.length===0&&<p className="p-6 text-center text-[#77736B]">No vehicle listings found.</p>}</div></>}
            {section === "users" && <><h2 className="mb-4 text-2xl font-bold">Registered users ({users.length})</h2><div className="overflow-x-auto rounded-2xl border border-[#D8CEC1] bg-white"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-[#E9E4DA]"><tr>{["Name","Email","Phone","City","Status","Joined","Controls"].map(x=><th key={x} className="px-4 py-3">{x}</th>)}</tr></thead><tbody>{users.map(u=><tr key={u._id} className="border-t border-[#eee7de]"><td className="px-4 py-3 font-semibold">{u.name}{u.email?.toLowerCase()===OWNER_EMAIL&&<span className="ml-2 rounded-full bg-[#E9E4DA] px-2 py-1 text-xs">OWNER</span>}</td><td className="px-4 py-3">{u.email}</td><td className="px-4 py-3">{u.phone || "—"}</td><td className="px-4 py-3">{u.city || "—"}</td><td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${u.status === "suspended" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{u.status || "active"}</span></td><td className="px-4 py-3">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td><td className="px-4 py-3">{u.email?.toLowerCase()===OWNER_EMAIL?<span className="text-xs text-[#77736B]">Owner protected</span>:<div className="flex flex-wrap gap-2"><button onClick={()=>toggleUserStatus(u)} className={`rounded-lg px-3 py-2 text-xs font-semibold ${u.status === "suspended" ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-amber-50 text-amber-700 hover:bg-amber-100"}`}>{u.status === "suspended" ? "Reactivate" : "Suspend"}</button><button onClick={()=>removeUser(u)} className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100"><Trash2 size={15}/> Delete</button></div>}</td></tr>)}</tbody></table>{users.length===0&&<p className="p-6 text-center text-[#77736B]">No users found.</p>}</div></>}
            {section === "messages" && <><h2 className="mb-4 text-2xl font-bold">Marketplace messages ({messages.length})</h2><div className="grid gap-3">{messages.map(m=><article key={m._id} className="rounded-2xl border border-[#D8CEC1] bg-white p-4"><div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">{m.fromName || m.fromEmail} <span className="font-normal text-[#77736B]">→ {m.toName || m.toEmail}</span></p><time className="text-xs text-[#77736B]">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}</time></div>{m.vehicleTitle&&<p className="mt-1 text-xs text-[#B86F52]">Vehicle: {m.vehicleTitle}</p>}<p className="mt-3 whitespace-pre-wrap text-sm">{m.text}</p><p className="mt-2 text-xs text-[#77736B]">{m.fromEmail} → {m.toEmail}</p></article>)}{messages.length===0&&<p className="rounded-xl bg-white p-6 text-center">No messages found.</p>}</div></>}
          </>}
        </section>
      </main>
    </div>
  );
}
