import React, { useState, useEffect } from "react";
import { Container, Box, Typography, Modal, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/discover/Header";
import SearchBar from "../components/discover/SearchBar";
import ChatHistoryTabs from "../components/chatHistory/ChatHistoryTabs";
import ChatHistoryList, {
  type Chat,
} from "../components/chatHistory/ChatHistoryList";
import type { Persona } from "../types";

interface ChatMessage {
  persona: string;
  user_message: string;
  ai_response: string;
  timestamp: string;
  session_id?: string;
  archived?: boolean;
}

interface SessionChat {
  session_id: string;
  persona: string;
  last_message: string;
  date: string;
  chats: ChatMessage[];
  archived?: boolean;
  lastTimestamp: string;
}

const ChatHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"all" | "archived">("all");
  const [search, setSearch] = useState("");
  const [sessions, setSessions] = useState<SessionChat[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionChat | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [personas, setPersonas] = useState<Persona[]>([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPersonas(data.data);
        }
      });
  }, []);

  // Function to get persona details by ID
  const getPersonaById = (personaId: string) => {
    return personas.find((p) => p.id === personaId);
  };

  // Function to handle opening a specific chat
  const handleOpenChat = (session: SessionChat) => {
    const personaId = session.persona;
    const persona = getPersonaById(personaId);

    if (persona) {
      // Navigate to the chat page with the specific persona and session ID
      navigate(`/chat/${personaId}?session=${session.session_id}`);
    } else {
      console.error(`Persona with ID ${personaId} not found`);
    }
  };

  // Function to handle archiving a session
  const handleArchiveSession = async (session: SessionChat) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas/chats/archive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: session.session_id
        })
      });

      const data = await response.json();
      if (data.success) {
        console.log(`Archived session ${session.session_id}`);
        // Refresh the sessions list
        setSessions(prev => prev.filter(s => s.session_id !== session.session_id));
      } else {
        console.error('Failed to archive session:', data.message);
      }
    } catch (error) {
      console.error('Error archiving session:', error);
    }
  };

  // Function to handle unarchiving a session
  const handleUnarchiveSession = async (session: SessionChat) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas/chats/unarchive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          session_id: session.session_id
        })
      });

      const data = await response.json();
      if (data.success) {
        console.log(`Unarchived session ${session.session_id}`);
        // Refresh the sessions list
        setSessions(prev => prev.filter(s => s.session_id !== session.session_id));
      } else {
        console.error('Failed to unarchive session:', data.message);
      }
    } catch (error) {
      console.error('Error unarchiving session:', error);
    }
  };

  useEffect(() => {
    // Get user from localStorage
    let userId = "";
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      userId = user.id || "";
      console.log("User from localStorage:", user);
      console.log("User ID:", userId);
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
    }

    if (!userId) {
      console.log("No user ID found, skipping fetch");
      return;
    }

    const token = localStorage.getItem("token");
    const fetchUrl = `${import.meta.env.VITE_BACKEND_URL}/api/personas/chats?user=${userId}&persona=all&archived=${tab === "archived"}`;
    console.log("Fetch URL:", fetchUrl);

    // Fetch all chats for the user
    fetch(fetchUrl, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    })
      .then((res) => {
        console.log("Response status:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("Response data:", data);
        if (data.success && Array.isArray(data.chats)) {
          console.log("All fetched chats:", data.chats);
          // Group chats by persona+session_id for legacy chats
          const sessionMap: { [session_id: string]: ChatMessage[] } = {};
          data.chats.forEach((chat: ChatMessage) => {
            let sessionId;
            if (chat.session_id) {
              sessionId = chat.session_id;
            } else {
              const date = new Date(chat.timestamp);
              const day = `${date.getFullYear()}-${
                date.getMonth() + 1
              }-${date.getDate()}`;
              sessionId = `legacy_session_${chat.persona}_${day}`;
            }
            if (!sessionMap[sessionId]) sessionMap[sessionId] = [];
            sessionMap[sessionId].push(chat);
          });
          const sessionEntries = Object.entries(sessionMap);
          console.log(
            "Session map:",
            sessionEntries.map(([id, chats]) => ({
              id,
              persona: chats[0]?.persona,
              count: chats.length,
            }))
          );
          // For each session, get the latest message (user or ai)
          const sessionChats: SessionChat[] = sessionEntries.map(
            ([session_id, chats]) => {
              // Sort chats within session by timestamp to ensure correct order
              chats.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
              const lastChat = chats[chats.length - 1];
              return {
                session_id,
                persona: chats[0]?.persona || lastChat.persona,
                last_message: lastChat.ai_response || lastChat.user_message,
                date: new Date(lastChat.timestamp).toLocaleDateString(),
                chats,
                archived: chats.some(chat => chat.archived) || tab === "archived",
                lastTimestamp: lastChat.timestamp // Add this for sorting sessions
              };
            }
          );

          // Sort sessions by their last message timestamp (latest first)
          sessionChats.sort((a, b) => new Date(b.lastTimestamp).getTime() - new Date(a.lastTimestamp).getTime());
          console.log("Sessions created:", sessionChats.length);
          console.log(
            "All sessions:",
            sessionChats.map((s) => ({
              session_id: s.session_id,
              persona: s.persona,
              count: s.chats.length,
              archived: s.archived
            }))
          );
          setSessions(sessionChats);
        } else {
          console.log("No chats found or invalid response format");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch chat history:", err);
      });
  }, [tab]);

  // Filter sessions by search
  const filteredSessions = sessions.filter(
    (session) =>
      session.persona.toLowerCase().includes(search.toLowerCase()) ||
      session.last_message.toLowerCase().includes(search.toLowerCase())
  );

  // Map to Chat interface for display
  const chats: Chat[] = filteredSessions.map((session, idx) => {
    const persona = getPersonaById(session.persona);
    return {
      avatar:
        persona?.avatar || "https://randomuser.me/api/portraits/men/32.jpg",
      name: persona?.name || `Persona: ${session.persona}`,
      message: session.last_message,
      date: session.date,
      archived: session.archived,
      onClick: () => {
        console.log("Session clicked:", session);
        // Open the chat directly
        handleOpenChat(session);
      },
      onRightClick: () => {
        // Show session details in modal
        setSelectedSession(session);
        setModalOpen(true);
      },
      onArchive: () => handleArchiveSession(session),
      onUnarchive: () => handleUnarchiveSession(session),
      key: session.session_id + "-" + idx,
    };
  });
  console.log("Chats array for UI:", chats);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      <Header />
      <Container sx={{ py: 4, maxWidth: 900 }}>
        <Box sx={{ width: "100%", mx: "auto", mb: 2, px: 1 }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search"
            fullWidth
            maxWidth={1200}
          />
        </Box>
        <Box sx={{ px: 1 }}>
          <ChatHistoryTabs tab={tab} onTabChange={setTab} />
        </Box>
        {chats.length > 0 ? (
          <ChatHistoryList chats={chats} />
        ) : (
          <Box sx={{ textAlign: "center", py: 4, color: "#666" }}>
            <Typography variant="h6">No chat history found</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Start chatting with personas to see your conversation history
              here.
            </Typography>
          </Box>
        )}

        {/* Session Details Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Paper
            sx={{ maxWidth: 600, mx: "auto", my: 8, p: 4, outline: "none" }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Session Details
            </Typography>
            {selectedSession && selectedSession.chats.length > 0 ? (
              selectedSession.chats.map((chat, idx) => (
                <Box
                  key={idx}
                  sx={{ mb: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}
                >
                  <Typography sx={{ fontWeight: 700 }}>
                    Persona: {chat.persona}
                  </Typography>
                  <Typography sx={{ color: "#333", mt: 1 }}>
                    User: {chat.user_message}
                  </Typography>
                  <Typography sx={{ color: "#388e3c", mt: 1 }}>
                    AI: {chat.ai_response}
                  </Typography>
                  <Typography sx={{ color: "#888", fontSize: 13, mt: 1 }}>
                    {new Date(chat.timestamp).toLocaleString()}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No messages in this session.</Typography>
            )}
          </Paper>
        </Modal>
      </Container>
    </Box>
  );
};

export default ChatHistoryPage;