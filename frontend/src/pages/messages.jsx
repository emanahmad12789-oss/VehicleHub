import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MessageCircle, Send, ArrowLeft, UserCircle, RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";

const API_URL = "https://vehicle-hub-h35a.vercel.app/api/messages";

function Messages() {
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem("vehicleHubToken") || "";
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("vehicleHubLoggedIn") || "null"); }
    catch { return null; }
  })();

  const requestedEmail = (searchParams.get("to") || "").trim().toLowerCase();
  const vehicleId = searchParams.get("vehicleId") || "";
  const vehicleTitle = searchParams.get("vehicleTitle") || "";

  const [conversations, setConversations] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(requestedEmail);
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const authHeaders = { Authorization: `Bearer ${token}` };

  const loadConversations = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_URL}/conversations`, { headers: authHeaders });
      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("Messages API returned a non-JSON page (HTTP " + response.status + "). Check backend deployment/protection.");
      }
      if (!response.ok) throw new Error(data.message || ("Could not load conversations (HTTP " + response.status + ")."));
      setConversations(Array.isArray(data.conversations) ? data.conversations : []);
    } catch (err) {
      setError(err.message || "Could not load conversations.");
    }
  }, [token]);

  const loadThread = useCallback(async (email) => {
    if (!token || !email) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/with/${encodeURIComponent(email)}`, {
        headers: authHeaders
      });
      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("Messages API returned a non-JSON page (HTTP " + response.status + "). Check backend deployment/protection.");
      }
      if (!response.ok) throw new Error(data.message || ("Could not load conversation (HTTP " + response.status + ")."));
      setOtherUser(data.otherUser || { email, name: email });
      setMessages(Array.isArray(data.messages) ? data.messages : []);
    } catch (err) {
      setError(err.message || "Could not load this conversation.");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    loadConversations();
    if (requestedEmail) {
      setSelectedEmail(requestedEmail);
      loadThread(requestedEmail);
    }
  }, [token, requestedEmail, loadConversations, loadThread]);

  const handleSelectConversation = (conversation) => {
    setSelectedEmail(conversation.email);
    setOtherUser({ email: conversation.email, name: conversation.name });
    loadThread(conversation.email);
  };

  const handleSend = async (event) => {
    event.preventDefault();
    const text = messageText.trim();
    if (!text || !selectedEmail || sending) return;

    setSending(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/with/${encodeURIComponent(selectedEmail)}`, {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ text, vehicleId, vehicleTitle })
      });
      const responseText = await response.text();
      let data = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("Messages API returned a non-JSON page (HTTP " + response.status + "). Check backend deployment/protection.");
      }
      if (!response.ok) throw new Error(data.message || ("Message could not be sent (HTTP " + response.status + ")."));

      setMessages((previous) => [...previous, data.message]);
      setMessageText("");
      await loadConversations();
    } catch (err) {
      setError(err.message || "Message could not be sent.");
    } finally {
      setSending(false);
    }
  };

  if (!token || !currentUser) {
    return (
      <div className="min-h-screen bg-[#F7F3EC]">
        <Navbar />
        <main className="max-w-xl mx-auto px-4 py-20 text-center">
          <MessageCircle size={48} className="mx-auto text-[#B86F52]" />
          <h1 className="text-3xl font-semibold text-[#26352D] mt-5">Log in to use Messages</h1>
          <p className="text-[#77736B] mt-3">Your conversations are saved to your VehicleHub account.</p>
          <Link to="/login" className="inline-block mt-6 bg-[#26352D] text-white px-6 py-3 rounded-xl">Go to Login</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F3EC]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-[#77736B] hover:text-[#B86F52] text-sm">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="mt-7">
            <p className="text-[#B86F52] text-sm font-semibold tracking-[0.15em] uppercase">Communication</p>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#26352D] mt-2">Messages</h1>
            <p className="text-[#77736B] mt-2">Messages are saved to your account and shared with the other user.</p>
          </div>
        </div>

        {error && <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}

        <div className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl overflow-hidden shadow-sm">
          <div className="grid md:grid-cols-[320px_1fr] min-h-[560px]">
            <aside className="border-b md:border-b-0 md:border-r border-[#D8CEC1]">
              <div className="p-5 border-b border-[#D8CEC1] flex justify-between items-center">
                <div className="flex items-center gap-2 text-[#26352D]">
                  <MessageCircle size={20} />
                  <h2 className="font-semibold">Conversations</h2>
                </div>
                <button type="button" onClick={loadConversations} className="text-[#77736B] hover:text-[#B86F52]" aria-label="Refresh conversations">
                  <RefreshCw size={17} />
                </button>
              </div>
              {conversations.length === 0 ? (
                <div className="p-6 text-sm text-[#77736B]">
                  No conversations yet. Open a vehicle listing and choose Message Seller to start one.
                </div>
              ) : conversations.map((conversation) => (
                <button key={conversation.email} type="button" onClick={() => handleSelectConversation(conversation)}
                  className={`w-full text-left p-5 border-b border-[#E5DED4] hover:bg-[#F7F3EC] transition ${selectedEmail === conversation.email ? "bg-[#F7F3EC]" : ""}`}>
                  <div className="flex gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#E9E4DA] text-[#26352D] flex items-center justify-center shrink-0"><UserCircle size={24} /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <h3 className="font-semibold text-[#26352D] truncate">{conversation.name || conversation.email}</h3>
                        <span className="text-xs text-[#9A9287]">{conversation.updatedAt ? new Date(conversation.updatedAt).toLocaleDateString() : ""}</span>
                      </div>
                      {conversation.vehicleTitle && <p className="text-xs text-[#B86F52] mt-1">{conversation.vehicleTitle}</p>}
                      <p className="text-sm text-[#77736B] truncate mt-1">{conversation.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))}
            </aside>

            <section className="flex flex-col min-h-[500px]">
              {!selectedEmail ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-20 h-20 bg-[#E9E4DA] rounded-full flex items-center justify-center"><MessageCircle size={38} className="text-[#9A9287]" /></div>
                  <h2 className="text-xl font-semibold text-[#26352D] mt-5">Select a conversation</h2>
                  <p className="text-[#77736B] mt-2 max-w-sm">Choose a saved conversation from the left or start from a vehicle listing.</p>
                </div>
              ) : (
                <>
                  <div className="p-5 border-b border-[#D8CEC1] flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#E9E4DA] text-[#26352D] flex items-center justify-center"><UserCircle size={25} /></div>
                    <div>
                      <h2 className="font-semibold text-[#26352D]">{otherUser?.name || selectedEmail}</h2>
                      <p className="text-sm text-[#B86F52]">{vehicleTitle || otherUser?.email || selectedEmail}</p>
                    </div>
                  </div>
                  <div className="flex-1 p-5 md:p-6 space-y-3 overflow-y-auto max-h-[500px]">
                    {loading ? <p className="text-center text-[#77736B] py-10">Loading messages...</p> :
                      messages.length === 0 ? <p className="text-center text-[#77736B] py-10">No messages yet. Say hello to start the conversation.</p> :
                      messages.map((message) => {
                        const mine = String(message.fromEmail || "").toLowerCase() === String(currentUser.email || "").toLowerCase();
                        return <div key={message._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${mine ? "bg-[#26352D] text-[#F7F3EC] rounded-tr-sm" : "bg-[#E9E4DA] text-[#4A4943] rounded-tl-sm"}`}>
                            <p className="break-words whitespace-pre-wrap">{message.text}</p>
                            <p className={`text-[11px] mt-2 ${mine ? "text-[#C9CEC9]" : "text-[#77736B]"}`}>{message.createdAt ? new Date(message.createdAt).toLocaleString() : ""}</p>
                          </div>
                        </div>;
                      })}
                  </div>
                  <form onSubmit={handleSend} className="p-4 border-t border-[#D8CEC1]">
                    <div className="flex gap-2">
                      <input type="text" value={messageText} onChange={(event) => setMessageText(event.target.value)}
                        placeholder="Write a message..." maxLength={4000} required
                        className="flex-1 min-w-0 bg-[#F7F3EC] border border-[#D8CEC1] rounded-xl px-4 py-3 outline-none" />
                      <button type="submit" disabled={sending || !messageText.trim()} aria-label="Send message"
                        className="bg-[#26352D] hover:bg-[#34483D] disabled:opacity-50 text-[#F7F3EC] px-5 rounded-xl transition">
                        <Send size={19} />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Messages;
