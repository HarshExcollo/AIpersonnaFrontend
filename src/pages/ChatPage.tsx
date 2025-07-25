import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  ClickAwayListener,
  useTheme,
  useMediaQuery,
  IconButton,
  TextField,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import type { Persona } from "../types";
import ChatHeader from "../components/ChatHeader";
import Sidebar from "../components/sidebar/Sidebar";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { sendToWebhook, isWebhookPersona } from "../services/webhookService";
import FormattedOutput from "../components/FormattedOutput";
import { getSessionId, startNewSession } from "../utils/session";
import ChatInputBar from "../components/ChatInputBar";
import ChatSearchModal from "../components/ChatSearchModal";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

interface ChatPageProps {
  onBack: () => void;
}

const TypingIndicator = () => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, py: 1 }}>
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        bgcolor: "#52946B",
        animation: "typing 1.4s infinite ease-in-out",
        animationDelay: "0s",
        "@keyframes typing": {
          "0%, 80%, 100%": {
            opacity: 0.3,
            transform: "scale(0.8)",
          },
          "40%": {
            opacity: 1,
            transform: "scale(1)",
          },
        },
      }}
    />
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        bgcolor: "#52946B",
        animation: "typing 1.4s infinite ease-in-out",
        animationDelay: "0.2s",
        "@keyframes typing": {
          "0%, 80%, 100%": {
            opacity: 0.3,
            transform: "scale(0.8)",
          },
          "40%": {
            opacity: 1,
            transform: "scale(1)",
          },
        },
      }}
    />
    <Box
      sx={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        bgcolor: "#52946B",
        animation: "typing 1.4s infinite ease-in-out",
        animationDelay: "0.4s",
        "@keyframes typing": {
          "0%, 80%, 100%": {
            opacity: 0.3,
            transform: "scale(0.8)",
          },
          "40%": {
            opacity: 1,
            transform: "scale(1)",
          },
        },
      }}
    />
  </Box>
);

export default function ChatPage({ onBack }: ChatPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionIdFromUrl = searchParams.get("session");

  // All hooks must be called unconditionally at the top
  const [persona, setPersona] = useState<Persona | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [messages, setMessages] = useState<
    { sender: "user" | "ai"; text: string; fileUrl?: string; fileType?: string; isTyping?: boolean; id?: string; fileUrls?: string[]; fileTypes?: string[] }[]
  >([]);
  const [messageInput, setMessageInput] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [userAvatar, setUserAvatar] = useState("");
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [allSessions, setAllSessions] = useState([]); // [{ session_id, messages, date }]
  const [allPersonas, setAllPersonas] = useState<Persona[]>([]);

  // Fetch all personas for persona switcher
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAllPersonas(data.data);
        }
      });
  }, []);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserAvatar(user.avatar || "");
    } catch {
      // Intentionally empty - user avatar is optional
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas/${id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched persona data:", data);
          if (data.success && data.data) {
            console.log("Setting persona:", data.data);
            console.log("Persona avatar URL:", data.data.avatar);
            setPersona(data.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching persona:", error);
        });
    }
  }, [id]);

  // Load existing chat messages if session ID is provided
  const loadChatHistory = async (sessionId: string) => {
    setIsLoading(true);
    try {
      let userId = "current_user";
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        userId = user.id || "current_user";
      } catch (error) {
        console.error("Error getting user ID from localStorage:", error);
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/personas/chats?user=${userId}&persona=${persona?.id}&session_id=${sessionId}`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.chats)) {
          console.log('Loading chat history:', data.chats);
          // Convert chat data to message format
                    const loadedMessages = data.chats.flatMap((chat: { _id: string; user_message: string; ai_response: string; fileUrl?: string; fileType?: string; fileUrls?: string[]; fileTypes?: string[] }) => {
            console.log('Processing chat:', { 
              _id: chat._id,
              user_message: chat.user_message, 
              fileUrl: chat.fileUrl, 
              fileType: chat.fileType 
            });
            return [
              { sender: "user" as const, text: chat.user_message, fileUrl: chat.fileUrl, fileType: chat.fileType, id: chat._id },
            { sender: "ai" as const, text: chat.ai_response, fileUrls: chat.fileUrls, fileTypes: chat.fileTypes },
            ];
          });

          console.log('Loaded messages:', loadedMessages);
          setMessages(loadedMessages);
          setCurrentSessionId(sessionId);
        }
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sessionIdFromUrl && persona) {
      loadChatHistory(sessionIdFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionIdFromUrl, persona]);

  // Dynamic suggestion chips based on persona department
  const getSuggestionChips = (department: string, personaId: string) => {
    // Special handling for Head of Payment persona
    if (personaId === "1") {
      return [
        "Analyze payment gateway performance",
        "Review transaction failure rates",
        "Optimize checkout conversion rates",
        "Check payment processing costs",
        "Evaluate fraud detection metrics",
      ];
    }

    // Special handling for Product Manager persona
    if (personaId === "2") {
      return [
        "Review product roadmap priorities",
        "Analyze feature adoption metrics",
        "Get user feedback insights",
        "Check sprint progress status",
        "Evaluate market competitive analysis",
      ];
    }

    switch (department) {
      case "Tech":
        return [
          "Ask about QR transaction flows",
          "Get merchant risk metrics",
          "Clarify settlement SLA",
        ];
      case "Marketing":
        return [
          "Request latest campaign stats",
          "Ask for competitor analysis",
          "Get social media insights",
        ];
      case "Sales":
        return [
          "Ask for sales pipeline update",
          "Request lead conversion rates",
          "Get monthly sales summary",
        ];
      default:
        return ["Ask a question", "Request a report", "Get latest updates"];
    }
  };
  const suggestionChips = React.useMemo(
    () => persona ? getSuggestionChips(persona.department, persona.id) : [],
    [persona]
  );

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (messageListRef.current) {
        messageListRef.current.scrollTo({
          top: messageListRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    };

    // Use requestAnimationFrame to ensure DOM is fully updated
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(scrollToBottom);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Keyboard shortcut for Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Scroll to message by index
  const scrollToMessage = (idx: number) => {
    if (!messageListRef.current) return;
    const messageNodes = messageListRef.current.querySelectorAll('[data-msg-idx]');
    const node = Array.from(messageNodes).find((el) => Number((el as HTMLElement).dataset.msgIdx) === idx);
    if (node) {
      (node as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
      (node as HTMLElement).style.background = "#fffde7";
      setTimeout(() => {
        (node as HTMLElement).style.background = "";
      }, 1200);
    }
  };

  // Fetch all sessions for persona when search modal opens
  useEffect(() => {
    const fetchAllSessions = async () => {
      if (!searchModalOpen || !persona) return;
      // User ID is handled in the API call below
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/personas/chats/all?persona=${persona.id}`;
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      console.log("[ChatPage] /api/personas/chats/all response:", data);
      if (data.success && Array.isArray(data.sessions)) {
        setAllSessions(data.sessions);
        console.log("[ChatPage] allSessions:", data.sessions);
      } else {
        setAllSessions([]);
        console.log("[ChatPage] allSessions: [] (no data)");
      }
    };
    fetchAllSessions();
  }, [searchModalOpen, persona]);

  // Handler for selecting a search result
  const handleSearchSelect = ({ session_id, msgIdx }: { session_id: string; msgIdx: number }) => {
    // If session_id is current, scroll to message
    if (session_id === currentSessionId) {
      scrollToMessage(msgIdx);
    } else {
      // Navigate to the session (reload page with session param)
      navigate(`/chat/${persona?.id}?session=${session_id}#msg${msgIdx}`);
      // Optionally, you can scroll after navigation
    }
    setSearchModalOpen(false);
  };
  // Handler for starting a new chat
  const handleStartNewChat = () => {
    // Start a new session (navigate to chat page without session param)
    navigate(`/chat/${persona?.id}`);
    setSearchModalOpen(false);
  };

  // Edit message handlers
  const handleEditMessage = (messageId: string, currentText: string) => {
    setEditingMessageId(null); // Cancel inline edit mode if any
    setEditingText("");
    setMessageInput(currentText); // Place message in chat bar
    // Remove all messages from this message onward
    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id === messageId);
      if (idx === -1) return prev;
      return prev.slice(0, idx);
    });
  };

  const handleSaveEdit = async (messageId: string) => {
    try {
      // 1. Update user message in backend
      const token = localStorage.getItem("token");
      const editRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas/chats/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          messageId: messageId,
          newText: editingText
        })
      });

      if (editRes.ok) {
        const msgIdx = messages.findIndex((m) => m.id === messageId);
        if (msgIdx === -1) return;

        // 2. Update frontend state instantly: update user message, show AI typing
        setMessages((prev) => {
          const newMessages = [...prev];
          // Update user message
          newMessages[msgIdx] = { ...newMessages[msgIdx], text: editingText };
          // Replace next AI message with typing indicator
          if (
            msgIdx + 1 < newMessages.length &&
            newMessages[msgIdx + 1].sender === "ai"
          ) {
            newMessages[msgIdx + 1] = {
              sender: "ai",
              text: "",
              isTyping: true,
            };
          }
          return newMessages;
        });
        setEditingMessageId(null);
        setEditingText("");

        // 3. Call webhook with the new message
        const personaId = persona?.id ? String(persona.id) : "";
        const personaName = persona?.name || "";
        let aiResponse = "";
        if (isWebhookPersona(personaId)) {
          aiResponse = await sendToWebhook(editingText, personaId, personaName);
        }

        // 4. Update AI response in backend
        await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas/chats/edit`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            messageId: messageId,
            newText: editingText, // (optional, but safe to send)
            newAIResponse: aiResponse
          })
        });

        // 5. Update frontend state with new AI response
        setMessages((prev) => {
          const newMessages = [...prev];
          if (
            msgIdx + 1 < newMessages.length &&
            newMessages[msgIdx + 1].sender === "ai"
          ) {
            newMessages[msgIdx + 1] = {
              ...newMessages[msgIdx + 1],
              text: aiResponse,
              isTyping: false,
            };
          }
          return newMessages;
        });
      } else {
        console.error("Failed to update message in backend");
      }
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  // Show loading indicator while loading chat history
  // if (isLoading) {
  //   return (
  //     <Box
  //       sx={{
  //         height: "100vh",
  //         bgcolor: "#fff",
  //         display: "flex",
  //         flexDirection: "column",
  //         alignItems: "center",
  //         justifyContent: "center",
  //       }}
  //     >
  //       <Typography variant="h6" sx={{ color: "#52946B" }}>
  //         Loading chat history...
  //       </Typography>
  //     </Box>
  //   );
  // }

  // Check if persona exists after loading is complete
  if (!persona) {
    return (
      <Box
        sx={{
          height: "100vh",
          bgcolor: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" sx={{ color: "#52946B" }}>
          Persona not found
        </Typography>
      </Box>
    );
  }

  // Handler to open sidebar from header
  const handleMenuClick = () => setSidebarOpen(true);
  // Handler to close sidebar
  const handleSidebarClose = () => setSidebarOpen(false);
  const SIDEBAR_WIDTH = 280; // Fixed width for consistent sidebar

  // Handler to close persona switcher
  const handleSwitcherClose = () => {
    setSwitcherOpen(false);
    setAnchorEl(null);
  };

  // Handler for switch persona
  const handleSwitchPersona = (personaId: string) => {
    setSwitcherOpen(false);
    navigate(`/chat/${personaId}`);
  };

  const handleAvatarClick = () => {
    navigate(`/view-persona/${persona.id}`);
  };

  // Updated handleSendMessage to support multiple images
  const handleSendMessage = async (msgObj: { message: string; fileUrl?: string; fileType?: string; fileUrls?: string[]; fileTypes?: string[] }) => {
    const trimmed = (msgObj.message || "").trim();
    const fileUrl = msgObj.fileUrl;
    const fileType = msgObj.fileType;
    const fileUrls = msgObj.fileUrls;
    const fileTypes = msgObj.fileTypes;
    if (!trimmed && !fileUrl && !(fileUrls && fileUrls.length > 0)) return;

    // Add user message with unique ID
    const messageId = Date.now().toString();
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: trimmed, fileUrl, fileType, fileUrls, fileTypes, id: messageId },
    ]);
    setMessageInput("");

    // Use existing session ID if available, otherwise start new session if this is the first message
    const sessionId =
      currentSessionId ||
      (messages.length === 0
        ? startNewSession(persona.id)
        : getSessionId(persona.id));

    if (!currentSessionId) {
      setCurrentSessionId(sessionId);
    }

    // Send message to backend for MongoDB storage
    let userId = "current_user"; // Default fallback
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      userId = user.id || "current_user";
    } catch (error) {
      console.error("Error getting user ID from localStorage:", error);
    }

    const personaId = String(persona.id);
    const personaName = persona.name;

    // Add typing indicator for AI
    setMessages((prev) => [
      ...prev,
      { sender: "ai", text: "", isTyping: true },
    ]);

    // Get AI response (webhook or default)
    let aiResponse = "This is a sample response from your AI Persona.";
    if (isWebhookPersona(personaId)) {
      try {
        aiResponse = await sendToWebhook(trimmed, personaId, personaName, fileUrl, fileType);
      } catch {
        aiResponse = "Sorry, there was an error contacting the AI service.";
      }
    }

    // Store both user message and AI response in MongoDB
    const token = localStorage.getItem("token");
    const chatData = {
      user: userId,
      persona: personaId,
      session_id: sessionId,
      user_message: String(trimmed),
      ai_response: aiResponse,
      fileUrl,
      fileType,
      fileUrls,
      fileTypes,
    };

    console.log('Storing chat with file info:', chatData);

    const storePromise = fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas/chats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(chatData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to store chat");
        }
        return res.json();
      })
      .then((data) => {
        // Update the user message with the MongoDB _id for editing capability
        if (data.success && data.chat && data.chat._id) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId && msg.sender === "user"
                ? { ...msg, id: data.chat._id }
                : msg
            )
          );
        }
      })
      .catch((err) => {
        console.error("Error storing chat in MongoDB:", err);
      });

    setTimeout(() => {
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          sender: "ai",
          text: aiResponse,
          isTyping: false,
        };
        return newMessages;
      });
    }, 800);

    // Wait for chat to be stored
    await storePromise;
  };

  // Check if user has sent first message
  const hasUserMessages =
    messages.filter((msg) => msg.sender === "user").length > 0;

  return (
    <Box
      sx={{
        height: "100vh",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100vw",
        maxWidth: "100vw",
      }}
    >
      {/* Full-width ChatHeader at the top */}
      <ChatHeader
        onBack={onBack}
        onMenu={handleMenuClick}
        isSidebarOpen={sidebarOpen}
        backIcon={
          <ChevronLeftIcon
            sx={{ fontSize: { xs: 24, sm: 28 }, color: "#012A1F" }}
          />
        }
      />

      {/* Content area with sidebar and main chat */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          overflow: "hidden",
          width: "100%",
          maxWidth: "100vw",
          position: "relative",
        }}
      >
        {/* Mobile backdrop overlay */}
        {sidebarOpen && isMobile && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1199,
              transition: "opacity 0.3s ease",
            }}
            onClick={handleSidebarClose}
          />
        )}

        {/* Sidebar - Always rendered but positioned off-screen when closed */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 1200,
            transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s cubic-bezier(.4,0,.2,1)",
          }}
        >
          <Sidebar 
            onClose={handleSidebarClose} 
            currentPersonaId={persona.id}
            onSearchChats={() => setSearchModalOpen(true)}
          />
        </Box>

        {/* Main chat area wrapper */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            transition: "margin-left 0.3s cubic-bezier(.4,0,.2,1)",
            ml: { xs: 0, md: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0 },
            height: "100%",
            width: "100%",
            maxWidth: "100vw",
            overflow: "hidden",
          }}
        >
          {/* Scrollable message list */}
          <Box
            ref={messageListRef}
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: "100vw",
              mx: 0,
              overflowY: "auto",
              overflowX: "hidden",
              pb: { xs: 20, sm: 30 },
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              minHeight: 0,
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: { xs: "100%", sm: 900 },
                mx: "auto",
                mb: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                px: { xs: 2, sm: 0 },
                overflow: "visible",
              }}
            >
              {/* Persona Profile with separate click handlers */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: { xs: 2, sm: 3 },
                  px: { xs: 2, sm: 0 },
                  pt: { xs: 2, sm: 3 },
                  pb: { xs: 1, sm: 2 },
                  position: 'relative',
                }}
              >
                {/* Avatar - clicks to view persona */}
                <Avatar
                  src={persona.avatar}
                  sx={{
                    width: { xs: 80, sm: 96 },
                    height: { xs: 80, sm: 96 },
                    mb: { xs: 1.5, sm: 2 },
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                  onClick={handleAvatarClick}
                  onError={(e) => {
                    console.error("Avatar image failed to load:", persona.avatar);
                    console.error("Error event:", e);
                  }}
                  onLoad={() => {
                    console.log("Avatar image loaded successfully:", persona.avatar);
                  }}
                />

                {/* Name */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: "#222",
                    mb: 0.5,
                    fontSize: { xs: "20px", sm: "24px" },
                    textAlign: "center",
                  }}
                >
                  {persona.name}
                </Typography>

                {/* Role + Switch Persona Button */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#2e7d32",
                      fontWeight: 400,
                      fontSize: { xs: 16, sm: 18 },
                      textAlign: "center",
                    }}
                  >
                    {persona.role}
                  </Typography>
                  <AutorenewIcon
                    onClick={() => setSwitcherOpen(true)}
                    sx={{
                      ml: 1,
                      color: '#2e7d32',
                      fontSize: 32,
                      cursor: 'pointer',
                      borderRadius: '50%',
                      transition: 'background 0.2s',
                      '&:hover': { background: '#e8f5e9' },
                    }}
                  />
                </Box>

                {/* Department */}
                {persona.department && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontWeight: 400,
                      fontSize: { xs: 14, sm: 16 },
                      textAlign: "center",
                      mt: 0.5,
                    }}
                  >
                    {persona.department}
                  </Typography>
                )}

                {/* Description */}
                {persona.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#888",
                      fontWeight: 400,
                      fontSize: { xs: 13, sm: 15 },
                      textAlign: "center",
                      mt: 0.5,
                    }}
                  >
                    {persona.description}
                  </Typography>
                )}

                {/* Switch Persona Modal */}
                <Dialog open={switcherOpen} onClose={handleSwitcherClose} maxWidth="xs" fullWidth>
                  <DialogTitle sx={{ fontWeight: 600, fontSize: 22, color: '#222', textAlign: 'center' }}>Switch Persona</DialogTitle>
                  <DialogContent sx={{ p: 3 }}>
                    {allPersonas.filter(p => p.id !== persona.id).map((p) => (
                      <Box
                        key={p.id}
                        sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, cursor: 'pointer', borderRadius: 2, p: 1.2, '&:hover': { background: '#f5f5f5' } }}
                        onClick={() => handleSwitchPersona(p.id)}
                      >
                        <Avatar src={p.avatar} sx={{ width: 48, height: 48 }} />
                        <Box>
                          <Typography sx={{ fontWeight: 600, fontSize: 18, color: '#222' }}>{p.name}</Typography>
                          <Typography sx={{ color: '#2e7d32', fontSize: 16 }}>{p.role}</Typography>
                        </Box>
                      </Box>
                    ))}
                    {allPersonas.filter(p => p.id !== persona.id).length === 0 && (
                      <Typography sx={{ color: '#888', textAlign: 'center', mt: 2 }}>No other personas available.</Typography>
                    )}
                  </DialogContent>
                  <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
                    <Button onClick={handleSwitcherClose} variant="outlined" color="primary">Cancel</Button>
                  </DialogActions>
                </Dialog>
              </Box>

              {/* Messages */}
              {messages.map((msg, idx) =>
                msg.sender === "ai" ? (
                  <Box key={idx} data-msg-idx={idx} sx={{ width: "100%", display: "flex", justifyContent: "flex-start", mb: 2 }}>
                    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "flex-end", gap: 2 }}>
                      <Avatar sx={{ width: 42, height: 42, mb: 0.5 }}>
                        <img src={persona.avatar} alt="AI" style={{ width: 48, height: 48, borderRadius: "50%" }} />
                      </Avatar>
                      <Box>
                        <Box sx={{ color: "#52946B", fontWeight: 500, fontSize: 16, mb: 1 }}>{persona.name}</Box>
                        {msg.isTyping ? (
                          <Box sx={{ bgcolor: "#F0F5F2", color: "#4e5357", px: { xs: 2.5, sm: 2 }, py: { xs: 2, sm: 2.5 }, borderRadius: 3, fontSize: 16, fontWeight: 400, maxWidth: { xs: "100%", sm: 600 }, wordBreak: "break-word", boxShadow: "none", lineHeight: 1.5, textAlign: "left", whiteSpace: "pre-wrap" }}>
                            <TypingIndicator />
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, maxWidth: { xs: "100%", sm: 600 } }}>
                            {msg.fileUrl && (
                              <Box sx={{ bgcolor: "#F0F5F2", borderRadius: 3, p: 1, boxShadow: "none" }}>
                                {msg.fileType && msg.fileType.startsWith('image/') ? (
                                  <img 
                                    src={msg.fileUrl} 
                                    alt="attachment" 
                                    style={{ 
                                      maxWidth: 250, 
                                      maxHeight: 250, 
                                      borderRadius: 8,
                                      display: 'block',
                                      width: '100%',
                                      height: 'auto'
                                    }} 
                                  />
                                ) : (
                        <Box
                          sx={{
                                      width: 20, 
                                      height: 20, 
                                      bgcolor: '#4e5357', 
                                      borderRadius: 1,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => window.open(msg.fileUrl, '_blank')}
                                  >
                                    <Box sx={{ 
                                      width: 12, 
                                      height: 12, 
                                      bgcolor: '#fff', 
                                      borderRadius: 0.5 
                                    }} />
                        </Box>
                                )}
                              </Box>
                            )}
                            {msg.text && (
                              <>
                              <Box sx={{ 
                            bgcolor: "#F0F5F2",
                            color: "#4e5357",
                            px: { xs: 2.5, sm: 2 },
                            py: { xs: 2, sm: 2.5 },
                            borderRadius: 3,
                            fontSize: 16,
                            fontWeight: 400,
                            wordBreak: "break-word",
                            boxShadow: "none",
                            lineHeight: 1.5,
                            textAlign: "left",
                            whiteSpace: "pre-wrap",
                                maxWidth: '100%'
                              }}>
                                {msg.text.match(/(\n\s*[-*]|^\d+\.|^#)/m) ? (
                            <FormattedOutput content={msg.text} />
                          ) : (
                            msg.text
                          )}
                        </Box>
                              <IconButton
                                size="small"
                                aria-label="Copy AI response"
                                sx={{ mt: 0.5, alignSelf: 'flex-start', color: '#4e5357' }}
                                onClick={() => {
                                  if (msg.text) {
                                    navigator.clipboard.writeText(msg.text);
                                  }
                                }}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                              </>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box key={idx} data-msg-idx={idx} sx={{ width: "100%", display: "flex", justifyContent: "flex-end", mb: 2, mr: { xs: 0, sm: 4 } }}>
                    <Box sx={{ display: "flex", flexDirection: "row-reverse", alignItems: "flex-end", gap: 1 }}>
                      <Avatar sx={{ width: 42, height: 42, mb: 0.5 }}>
                        {userAvatar ? (
                          <img src={userAvatar} alt="User" style={{ width: 48, height: 48, borderRadius: "50%" }} />
                        ) : (
                          <span style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 500, color: "#fff" }}>U</span>
                        )}
                      </Avatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1, maxWidth: { xs: "100%", sm: 400 } }}>
                        {/* Multiple images support */}
                        {msg.fileUrls && msg.fileUrls.length > 0 && (
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                            {msg.fileUrls.map((url: string, i: number) => (
                              <img
                                key={i}
                                src={url}
                                alt={`attachment-${i}`}
                                style={{ width: '3rem', height: '3rem', display: 'block' }}
                              />
                            ))}
                          </Box>
                        )}
                        {/* Single file fallback */}
                        {msg.fileUrl && !msg.fileUrls && (
                          msg.fileType && msg.fileType.startsWith('image/') ? (
                            <img 
                              src={msg.fileUrl} 
                              alt="attachment" 
                              style={{
                                width: '3rem',
                                height: '3rem',
                                display: 'block',
                              }}
                            />
                          ) : (
                            <Box 
                              sx={{ 
                                width: 20, 
                                height: 20, 
                                bgcolor: '#fff', 
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                              onClick={() => window.open(msg.fileUrl, '_blank')}
                            >
                              <Box sx={{ 
                                width: 12, 
                                height: 12, 
                                bgcolor: '#00875A', 
                                borderRadius: 0.5 
                              }} />
                            </Box>
                          )
                        )}
                        {msg.text && (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ 
                              bgcolor: "#00875A",
                              color: "#fff",
                              px: { xs: 2.5, sm: 3 },
                              py: { xs: 2, sm: 2.5 },
                              borderRadius: 3,
                              fontSize: 16,
                              fontWeight: 400,
                              wordBreak: "break-word",
                              boxShadow: "0 2px 8px rgba(44,62,80,0.04)",
                              lineHeight: 1.5,
                              textAlign: "start",
                              whiteSpace: "pre-wrap",
                              maxWidth: '100%',
                              '&:hover + .edit-button-container .edit-button': {
                                opacity: 1
                              }
                            }}>
                              {editingMessageId === msg.id ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                  <TextField
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    multiline
                                    fullWidth
                                    variant="outlined"
                                    sx={{
                                      '& .MuiOutlinedInput-root': {
                                        color: '#fff',
                                        '& fieldset': {
                                          borderColor: 'rgba(255,255,255,0.3)',
                                        },
                                        '&:hover fieldset': {
                                          borderColor: 'rgba(255,255,255,0.5)',
                                        },
                                        '&.Mui-focused fieldset': {
                                          borderColor: '#fff',
                                        },
                                      },
                                    }}
                                  />
                                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleSaveEdit(msg.id!)}
                                      sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }}
                                    >
                                      <CheckIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={handleCancelEdit}
                                      sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }}
                                    >
                                      <CloseIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </Box>
                              ) : (
                                <Box>{msg.text}</Box>
                              )}
                            </Box>
                            {editingMessageId !== msg.id && (
                              <Box className="edit-button-container" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <IconButton
                                  className="edit-button"
                                  size="small"
                                  onClick={() => handleEditMessage(msg.id!, msg.text)}
                                  sx={{
                                    color: '#666',
                                    bgcolor: 'rgba(0,0,0,0.05)',
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                    '&:hover': {
                                      bgcolor: 'rgba(0,0,0,0.1)',
                                    }
                                  }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            )}
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                )
              )}
            </Box>

            {/* Persona Switcher Popup */}
            {switcherOpen && anchorEl && (
              <ClickAwayListener onClickAway={handleSwitcherClose}>
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: 140, sm: 160 },
                    left: { xs: "50%", sm: "calc(50% + 100px)" },
                    transform: { xs: "translateX(-50%)", sm: "none" },
                    bgcolor: "#fafbfa",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px 0 rgba(44,62,80,0.10)",
                    p: { xs: 1, sm: 1.1 },
                    minWidth: { xs: 200, sm: 160 },
                    zIndex: 30,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#888",
                      fontWeight: 600,
                      mb: 1,
                      fontSize: { xs: 14, sm: 15 },
                    }}
                  >
                    Switch Persona
                  </Typography>
                  {/* Optionally, you can fetch and show other personas for switching here if needed */}
                </Box>
              </ClickAwayListener>
            )}
          </Box>

          {/* Fixed elements at the bottom */}
          <Box
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pt: 0,
              pb: { xs: 2, sm: 4 },
              background:
                "linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 20%)",
            }}
          >
            {/* Suggestion Chips - Hide after user sends first message */}
            {/* Removed suggestion chips rendering from ChatPage */}

            {/* Chat InputBar with file upload support */}
            <ChatInputBar
                  value={messageInput}
              onChange={setMessageInput}
              onSend={handleSendMessage}
              disabled={isLoading}
              persona={persona}
              sidebarOpen={sidebarOpen}
              sidebarWidth={SIDEBAR_WIDTH}
              maxWidth={960}
              suggestions={suggestionChips}
              showSuggestions={!hasUserMessages}
            />
            </Box>
          </Box>
        </Box>
      <ChatSearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        sessions={allSessions}
        onSelect={handleSearchSelect}
        onStartNewChat={handleStartNewChat}
      />
    </Box>
  );
}
