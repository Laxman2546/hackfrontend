import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../api/villageApi";

const quickPrompts = [
  "How much time will my complaint take?",
  "How do I check village project status?",
  "Water issue in my area",
  "Garbage not collected",
];

const systemPrompt = `You are Village AI, a friendly assistant for citizens of a village.
Help with:
- complaint timing and status guidance
- water, road, drainage, garbage, and sanitation issues
- village project progress and local updates
- how to write a clear complaint

Keep replies short, practical, and helpful.
If the user asks something unrelated to village issues, gently bring them back to local civic help.`;

const bubbleBase = {
  maxWidth: "78%",
  padding: "14px 16px",
  borderRadius: "18px",
  lineHeight: 1.5,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
};

function isUrl(value) {
  return /^https?:\/\//i.test(value || "");
}

function getLocalReply(message, village) {
  const text = message.toLowerCase();

  if (
    text.includes("time") ||
    text.includes("how long") ||
    text.includes("when")
  ) {
    return "Most village complaints are reviewed within 24 to 72 hours. If it needs field verification, it can take a little longer.";
  }

  if (
    text.includes("status") ||
    text.includes("track") ||
    text.includes("complaint")
  ) {
    return "You can check your complaint status from the Complaints page. If you want, I can help you phrase the issue clearly so ward staff can process it faster.";
  }

  if (text.includes("water")) {
    return "For water issues, include the exact street or landmark, a short description, and whether the problem is leaking, low supply, or contamination.";
  }

  if (text.includes("garbage") || text.includes("waste")) {
    return "For garbage complaints, mention the collection spot, how often pickup is missed, and whether it is affecting homes, shops, or schools.";
  }

  if (text.includes("road") || text.includes("street")) {
    return "For road issues, add the location, nearest landmark, and whether it is a pothole, drainage issue, or broken surface.";
  }

  return village
    ? `I can help with village complaints, project updates, and timing questions for ${village}. Try asking about complaint time, water issues, roads, garbage, or project status.`
    : "I can help with village complaints, project updates, and timing questions. Try asking about complaint time, water issues, roads, garbage, or project status.";
}

async function runVillageAI(message, chatHistory, village) {
  const apiKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.VITE_API_KEY ||
    import.meta.env.VITE_VILLAGE_AI_URL ||
    "";

  if (!apiKey) {
    return getLocalReply(message, village);
  }

  if (isUrl(apiKey)) {
    const response = await fetch(apiKey, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        messages: chatHistory.map((item) => ({
          role: item.role,
          content: item.content,
        })),
        village: village || "",
        source: "citizen_village_chat",
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(
        data?.message || data?.error || "AI service is unavailable.",
      );
    }

    return (
      data?.reply ||
      data?.response ||
      data?.message ||
      data?.answer ||
      data?.content ||
      "I could not understand the response from the AI service."
    );
  }

  const history = chatHistory.map((item) => ({
    role: item.role === "user" ? "user" : "model",
    parts: [{ text: item.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: [
          ...history,
          {
            role: "user",
            parts: [{ text: message }],
          },
        ],
        generationConfig: {
          temperature: 0.8,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1024,
        },
      }),
    },
  );

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data?.error?.message || data?.message || "Gemini request failed.",
    );
  }

  const reply = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();
  return (
    reply || "I received a response, but it did not include readable text."
  );
}

export default function VillageChat() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello. I am your village helper. Ask me about complaint timing, village issues, project status, water, roads, garbage, or anything local you need help with.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const response = await getCurrentUser();
        if (!active) return;
        const user = response?.user || response?.data || response;
        setProfile(user || null);
      } catch {
        if (active) setProfile(null);
      } finally {
        if (active) setLoadingProfile(false);
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } finally {
      navigate("/citizen-login");
    }
  };

  const chatMeta = useMemo(
    () => ({
      village: profile?.village || "",
      userName: profile?.name || profile?.full_name || profile?.username || "",
    }),
    [profile],
  );

  const sendMessage = async (text) => {
    const message = (text ?? input).trim();
    if (!message || sending) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };
    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput("");
    setSending(true);

    try {
      const reply = await runVillageAI(message, nextHistory, chatMeta.village);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: err?.message || "Unable to reach the AI chat service.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(34, 197, 94, 0.18), transparent 30%), linear-gradient(180deg, #f7fff8 0%, #eaf8ee 100%)",
        color: "#0f172a",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 24px",
          borderBottom: "1px solid rgba(148, 163, 184, 0.25)",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <div
            style={{ fontSize: "14px", color: "#64748b", marginBottom: "4px" }}
          >
            Citizen Assist
          </div>
          <h1 style={{ margin: 0, fontSize: "24px" }}>Village Chat</h1>
        </div>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <NavLink
            to="/complaints"
            style={{
              textDecoration: "none",
              color: "#0f172a",
              fontWeight: 700,
              padding: "10px 14px",
              borderRadius: "12px",
              background: "white",
              border: "1px solid rgba(148, 163, 184, 0.3)",
            }}
          >
            Complaints
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              border: "none",
              background: "linear-gradient(135deg, #14532d, #16a34a)",
              color: "white",
              padding: "10px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "28px 18px 40px",
        }}
      >
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: "18px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(148, 163, 184, 0.22)",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div
              style={{
                padding: "18px 20px",
                borderBottom: "1px solid rgba(148, 163, 184, 0.18)",
              }}
            >
              <div style={{ fontSize: "14px", color: "#64748b" }}>
                {loadingProfile
                  ? "Loading your village profile..."
                  : chatMeta.village
                    ? `Helping residents of ${chatMeta.village}`
                    : "Helping village residents with local questions"}
              </div>
            </div>

            <div
              style={{
                height: "62vh",
                minHeight: "520px",
                overflowY: "auto",
                padding: "22px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      message.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      ...bubbleBase,
                      background:
                        message.role === "user"
                          ? "linear-gradient(135deg, #14532d, #16a34a)"
                          : "#ecfdf5",
                      color: message.role === "user" ? "white" : "#0f172a",
                      border:
                        message.role === "user"
                          ? "1px solid #14532d"
                          : "1px solid #bbf7d0",
                    }}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                    paddingLeft: "6px",
                  }}
                >
                  Village AI is typing...
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              style={{
                borderTop: "1px solid rgba(148, 163, 184, 0.18)",
                padding: "16px",
                display: "grid",
                gap: "12px",
                background: "#ffffff",
              }}
            >
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about complaint timing, water, roads, garbage, project status, or any village issue..."
                rows={3}
                style={{
                  width: "100%",
                  resize: "none",
                  borderRadius: "16px",
                  border: "1px solid rgba(148, 163, 184, 0.35)",
                  padding: "14px 16px",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => setInput(prompt)}
                      style={{
                        border: "1px solid rgba(148, 163, 184, 0.3)",
                        background: "#f0fdf4",
                        color: "#334155",
                        padding: "8px 12px",
                        borderRadius: "999px",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    border: "none",
                    background: sending
                      ? "#94a3b8"
                      : "linear-gradient(135deg, #14532d, #22c55e)",
                    color: "white",
                    padding: "12px 20px",
                    borderRadius: "14px",
                    cursor: sending ? "not-allowed" : "pointer",
                    fontWeight: 700,
                    minWidth: "120px",
                  }}
                >
                  Send
                </button>
              </div>
            </form>
          </div>

          <aside
            style={{
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(148, 163, 184, 0.22)",
              borderRadius: "24px",
              padding: "20px",
              boxShadow: "0 24px 60px rgba(15, 23, 42, 0.06)",
              height: "fit-content",
            }}
          >
            <h2 style={{ marginTop: 0 }}>What you can ask</h2>
            <ul
              style={{ lineHeight: 1.8, color: "#334155", paddingLeft: "18px" }}
            >
              <li>How long a complaint may take</li>
              <li>Project progress and local updates</li>
              <li>Water, road, drainage, and garbage issues</li>
              <li>How to write a strong complaint message</li>
              <li>Village-related help and guidance</li>
            </ul>
          </aside>
        </section>
      </main>
    </div>
  );
}
