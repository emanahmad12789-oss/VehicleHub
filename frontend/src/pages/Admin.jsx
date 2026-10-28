import { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ShieldCheck, LayoutDashboard, CarFront, Users, MessageCircle, RefreshCw, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";

const API = "https://vehicle-hub-h35a.vercel.app/api";
function sessionData() {
  try { return { user: JSON.parse(localStorage.getItem("vehicleHubLoggedIn") || "null"), token: localStorage.getItem("vehicleHubToken") || "" }; }
  catch { return { user: null, token: "" }; }
}
export default function Admin() {
  const session = sessionData();
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState({ users: 0, vehicles: 0, messages: 0 });
  const [users, setUsers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const request = useCallback(async (path, options = {}) => {
    const response = await fetch(API + path, { ...options, headers: { Authorization: "Bearer " + session.token, "Content-Type": "application/json", ...(options.headers || {}) } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Request failed.");
    return data;
  }, [session.token]);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      if (tab === "overview") { const d = await request("/admin/overview"); setStats(d.stats); setVehicles(d.recentVehicles || []); }
      if (tab === "users") setUsers((await request("/admin/users")).users || []);
      if (tab === "vehicles") setVehicles((await request("/admin/vehicles")).vehicles || []);
      if (tab === "messages") setMessages((await request("/admin/messages")).messages || []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [request, tab]);
  useEffect(() => { load(); }, [load]);
  if (!session.user || !session.token) return <Navigate to="/login" replace />;
  const remove = async (kind, id) => {
    if (!window.confirm("Are you sure you want to permanently delete this " + (kind === "vehicles" ? "vehicle listing" : "message") + "?")) return;
    try {
      await request("/admin/" + kind + "/" + id, { method: "DELETE" });
      setNotice("Deleted successfully."); load();
    } catch (e) { setError(e.message); }
  };
  const tabs = [{ id: "overview", label: "Overview", Icon: LayoutDashboard }, { id: "vehicles", label: "Vehicles", Icon: CarFront }, { id: "users", label: "Users", Icon: Users }, { id: "messages", label: "Messages", Icon: MessageCircle }];
  return <div className="min-h-screen bg-[#F7F3EC] text-[#26352D]"><Navbar/><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    <div className="mb-7 flex flex-wrap items-center justify-between gap-3"><div><Link to="/" className="text-sm text-[#77736B]">← Back to website</Link><h1 className="mt-2 flex items-center gap-3 text-3xl font-bold"><ShieldCheck/> Owner Dashboard</h1><p className="mt-2 text-[#77736B]">Manage your VehicleHub marketplace.</p></div><button onClick={load} className="flex items-center gap-2 rounded-xl border border-[#D8CEC1] bg-[#FFFCF7] px-4 py-3"><RefreshCw size={17}/> Refresh</button></div>
    <nav className="mb-6 flex flex-wrap gap-2">{tabs.map(({id,label,Icon})=><button key={id} onClick={()=>{setTab(id);setNotice("");}} className={"flex items-center gap-2 rounded-xl px-4 py-3 font-medium "+(tab===id?"bg-[#26352D] text-white":"border border-[#D8CEC1] bg-[#FFFCF7]")}><Icon size={17}/>{label}</button>)}</nav>
    {error&&<div className="mb-4 rounded-xl bg-red-50 p-4 text-red-800">{error}</div>}{notice&&<div className="mb-4 rounded-xl bg-green-50 p-4 text-green-800">{notice}</div>}
    {loading?<div className="rounded-xl bg-[#FFFCF7] p-8">Loading…</div>:<>
      {tab==="overview"&&<><div className="grid gap-4 sm:grid-cols-3">{[["Users",stats.users],["Vehicles",stats.vehicles],["Messages",stats.messages]].map(([label,n])=><div key={label} className="rounded-2xl border border-[#D8CEC1] bg-[#FFFCF7] p-6"><p className="text-sm text-[#77736B]">Total {label}</p><p className="mt-2 text-3xl font-bold">{n}</p></div>)}</div><section className="mt-6 rounded-2xl border border-[#D8CEC1] bg-[#FFFCF7] p-5"><h2 className="mb-3 text-xl font-semibold">Recent vehicles</h2>{vehicles.map(v=><div key={v._id} className="flex justify-between gap-3 border-b border-[#E9E4DA] py-3"><span>{v.title||v.name||v.brand||"Vehicle"}</span><span>PKR {Number(v.price||0).toLocaleString("en-PK")}</span></div>)}</section></>}
      {tab==="users"&&<section className="overflow-x-auto rounded-2xl border border-[#D8CEC1] bg-[#FFFCF7] p-5"><h2 className="mb-4 text-xl font-semibold">Registered users</h2><table className="w-full text-left text-sm"><thead><tr className="border-b border-[#D8CEC1]"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">Joined</th></tr></thead><tbody>{users.map(u=><tr key={u._id} className="border-b border-[#E9E4DA]"><td className="p-3">{u.name}</td><td className="p-3">{u.email}</td><td className="p-3">{u.phone||"—"}</td><td className="p-3">{u.createdAt?new Date(u.createdAt).toLocaleDateString():"—"}</td></tr>)}</tbody></table>{users.length===0&&<p>No users found.</p>}</section>}
      {tab==="vehicles"&&<section className="overflow-x-auto rounded-2xl border border-[#D8CEC1] bg-[#FFFCF7] p-5"><h2 className="mb-4 text-xl font-semibold">All vehicle listings</h2><table className="w-full text-left text-sm"><thead><tr className="border-b border-[#D8CEC1]"><th className="p-3">Vehicle</th><th className="p-3">Seller</th><th className="p-3">Price</th><th className="p-3">Action</th></tr></thead><tbody>{vehicles.map(v=><tr key={v._id} className="border-b border-[#E9E4DA]"><td className="p-3">{v.title||v.name||v.brand||"Vehicle"}</td><td className="p-3">{v.sellerEmail||v.email||"—"}</td><td className="p-3">PKR {Number(v.price||0).toLocaleString("en-PK")}</td><td className="p-3"><button onClick={()=>remove("vehicles",v._id)} className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-red-700"><Trash2 size={15}/> Delete</button></td></tr>)}</tbody></table>{vehicles.length===0&&<p>No vehicles found.</p>}</section>}
      {tab==="messages"&&<section className="rounded-2xl border border-[#D8CEC1] bg-[#FFFCF7] p-5"><h2 className="mb-4 text-xl font-semibold">Messages</h2>{messages.map(m=><article key={m._id} className="flex flex-wrap justify-between gap-3 border-b border-[#E9E4DA] py-4"><div><p className="font-semibold">{m.fromName||m.fromEmail} → {m.toName||m.toEmail}</p><p className="mt-1 whitespace-pre-wrap">{m.text}</p><p className="mt-1 text-xs text-[#77736B]">{m.createdAt?new Date(m.createdAt).toLocaleString():""}</p></div><button onClick={()=>remove("messages",m._id)} className="flex h-fit items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-red-700"><Trash2 size={15}/> Delete</button></article>)}{messages.length===0&&<p>No messages found.</p>}</section>}
    </>}
  </main></div>;
}
