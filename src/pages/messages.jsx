import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  Send,
  ArrowLeft,
  UserCircle,
} from "lucide-react";

import Navbar from "../components/Navbar";

function Messages() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [sentMessages, setSentMessages] = useState([]);

  const conversations = [
    {
      id: 1,
      name: "Ahmed Khan",
      vehicle: "Toyota Corolla Altis 2022",
      lastMessage: "Is the car still available?",
      time: "10:30 AM",
    },
    {
      id: 2,
      name: "Sara Ali",
      vehicle: "Honda Civic Oriel 2021",
      lastMessage: "Can you share more pictures?",
      time: "Yesterday",
    },
  ];

  const handleSend = (e) => {
    e.preventDefault();

    if (!messageText.trim() || !selectedMessage) return;

    setSentMessages([
      ...sentMessages,
      {
        conversationId: selectedMessage.id,
        text: messageText.trim(),
      },
    ]);

    setMessageText("");
  };

  return (
    <div className="min-h-screen bg-[#F7F3EC]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#77736B] hover:text-[#B86F52] text-sm"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="mt-7">
            <p className="text-[#B86F52] text-sm font-semibold tracking-[0.15em] uppercase">
              Communication
            </p>

            <h1 className="text-3xl md:text-4xl font-semibold text-[#26352D] mt-2">
              Messages
            </h1>

            <p className="text-[#77736B] mt-2">
              Communicate with buyers and sellers.
            </p>
          </div>
        </div>

        <div className="bg-[#FFFCF7] border border-[#D8CEC1] rounded-2xl overflow-hidden shadow-sm">

          <div className="grid md:grid-cols-[320px_1fr] min-h-[550px]">

            {/* CONVERSATIONS */}
            <div className="border-r border-[#D8CEC1]">

              <div className="p-5 border-b border-[#D8CEC1]">
                <div className="flex items-center gap-2 text-[#26352D]">
                  <MessageCircle size={20} />
                  <h2 className="font-semibold">
                    Conversations
                  </h2>
                </div>
              </div>

              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setSelectedMessage(conversation)}
                  className={`w-full text-left p-5 border-b border-[#E5DED4] hover:bg-[#F7F3EC] transition ${
                    selectedMessage?.id === conversation.id
                      ? "bg-[#F7F3EC]"
                      : ""
                  }`}
                >
                  <div className="flex gap-3">

                    <div className="w-11 h-11 rounded-full bg-[#E9E4DA] text-[#26352D] flex items-center justify-center shrink-0">
                      <UserCircle size={24} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex justify-between gap-2">
                        <h3 className="font-semibold text-[#26352D]">
                          {conversation.name}
                        </h3>

                        <span className="text-xs text-[#9A9287]">
                          {conversation.time}
                        </span>
                      </div>

                      <p className="text-xs text-[#B86F52] mt-1">
                        {conversation.vehicle}
                      </p>

                      <p className="text-sm text-[#77736B] truncate mt-1">
                        {conversation.lastMessage}
                      </p>

                    </div>
                  </div>
                </button>
              ))}

            </div>

            {/* CHAT */}
            <div className="flex flex-col">

              {!selectedMessage ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">

                  <div className="w-20 h-20 bg-[#E9E4DA] rounded-full flex items-center justify-center">
                    <MessageCircle
                      size={38}
                      className="text-[#9A9287]"
                    />
                  </div>

                  <h2 className="text-xl font-semibold text-[#26352D] mt-5">
                    Select a conversation
                  </h2>

                  <p className="text-[#77736B] mt-2 max-w-sm">
                    Choose a conversation from the left to view messages.
                  </p>

                </div>
              ) : (
                <>
                  {/* CHAT HEADER */}
                  <div className="p-5 border-b border-[#D8CEC1]">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-full bg-[#E9E4DA] text-[#26352D] flex items-center justify-center">
                        <UserCircle size={25} />
                      </div>

                      <div>
                        <h2 className="font-semibold text-[#26352D]">
                          {selectedMessage.name}
                        </h2>

                        <p className="text-sm text-[#B86F52]">
                          {selectedMessage.vehicle}
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* CHAT MESSAGES */}
                  <div className="flex-1 p-6 space-y-4 overflow-y-auto">

                    <div className="flex justify-start">
                      <div className="bg-[#E9E4DA] text-[#4A4943] rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                        Hello! I'm interested in this vehicle.
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-[#26352D] text-[#F7F3EC] rounded-2xl rounded-tr-sm px-4 py-3 max-w-md">
                        Sure! What would you like to know?
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-[#E9E4DA] text-[#4A4943] rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                        {selectedMessage.lastMessage}
                      </div>
                    </div>

                    {sentMessages
                      .filter(
                        (message) =>
                          message.conversationId === selectedMessage.id
                      )
                      .map((message, index) => (
                        <div
                          key={index}
                          className="flex justify-end"
                        >
                          <div className="bg-[#26352D] text-[#F7F3EC] rounded-2xl rounded-tr-sm px-4 py-3 max-w-md">
                            {message.text}
                          </div>
                        </div>
                      ))}

                  </div>

                  {/* INPUT */}
                  <form
                    onSubmit={handleSend}
                    className="p-4 border-t border-[#D8CEC1]"
                  >
                    <div className="flex gap-2">

                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) =>
                          setMessageText(e.target.value)
                        }
                        placeholder="Write a message..."
                        className="flex-1 bg-[#F7F3EC] border border-[#D8CEC1] rounded-xl px-4 py-3 outline-none"
                      />

                      <button
                        type="submit"
                        className="bg-[#26352D] hover:bg-[#34483D] text-[#F7F3EC] px-5 rounded-xl transition"
                      >
                        <Send size={19} />
                      </button>

                    </div>
                  </form>

                </>
              )}

            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Messages;