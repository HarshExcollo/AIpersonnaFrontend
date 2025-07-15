import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Chip,
  InputBase,
  Paper,
  ClickAwayListener,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { IoSend } from "react-icons/io5";
import type { Persona } from "../types";
import ChatHeader from "../components/ChatHeader";
import Sidebar from "../components/sidebar/Sidebar";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { sendToWebhook, isWebhookPersona } from "../services/webhookService";
import FormattedOutput from "../components/FormattedOutput";
import { getSessionId, startNewSession } from "../utils/session";

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
    { sender: "user" | "ai"; text: string; isTyping?: boolean }[]
  >([]);
  const [messageInput, setMessageInput] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [userAvatar, setUserAvatar] = useState("");
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
          // Convert chat data to message format
          const loadedMessages = data.chats.flatMap((chat: { user_message: string; ai_response: string }) => [
            { sender: "user" as const, text: chat.user_message },
            { sender: "ai" as const, text: chat.ai_response },
          ]);

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

  if (!persona) {
    return <div>Persona not found</div>;
  }

  // Handler to open sidebar from header
  const handleMenuClick = () => setSidebarOpen(true);
  // Handler to close sidebar
  const handleSidebarClose = () => setSidebarOpen(false);
  const SIDEBAR_WIDTH = isMobile ? 280 : 160;

  // Handler to close persona switcher
  const handleSwitcherClose = () => {
    setSwitcherOpen(false);
    setAnchorEl(null);
  };

  const handleAvatarClick = () => {
    navigate(`/view-persona/${persona.id}`);
  };

  // Updated handleSendMessage with session ID logic and chat persistence
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = messageInput.trim();
    if (!trimmed) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
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

    // Check if this persona uses webhook
    if (isWebhookPersona(personaId)) {
      try {
        // Add a typing indicator
        setMessages((prev) => [
          ...prev,
          { sender: "ai", text: "", isTyping: true },
        ]);

        // Get AI response from webhook
        const webhookResponse = await sendToWebhook(
          trimmed,
          personaId,
          personaName
        );

        // Store both user message and AI response in MongoDB
        const token = localStorage.getItem("token");
        const storePromise = fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas/chats`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            user: userId,
            persona: personaId,
            session_id: sessionId,
            user_message: String(trimmed),
            ai_response: webhookResponse,
          }),
        })
          .then((res) => {
            if (!res.ok) {
              return res.text().then((text) => {
                throw new Error("Failed to store chat: " + text);
              });
            }
            return res.json();
          })
          .catch((err) => {
            console.error("Error storing chat in MongoDB:", err);
          });

        // Wait for chat to be stored
        await storePromise;

        // Replace the typing indicator with the actual response
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            sender: "ai",
            text: webhookResponse,
            isTyping: false,
          };
          return newMessages;
        });

        // Force scroll to bottom after AI response
        setTimeout(() => {
          if (messageListRef.current) {
            messageListRef.current.scrollTo({
              top: messageListRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 200);
      } catch (error) {
        console.error("Error processing webhook:", error);
        // Replace typing indicator with error message
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            sender: "ai",
            text: "I'm experiencing technical difficulties. Please try again or contact support.",
            isTyping: false,
          };
          return newMessages;
        });
      }
    } else {
      // For other personas, add typing indicator first
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "", isTyping: true },
      ]);

      const aiResponse = "This is a sample response from your AI Persona.";

      // Store both user message and AI response in MongoDB
      const token = localStorage.getItem("token");
      const storePromise = fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          user: userId,
          persona: personaId,
          session_id: sessionId,
          user_message: String(trimmed),
          ai_response: aiResponse,
        }),
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((text) => {
              throw new Error("Failed to store chat: " + text);
            });
          }
          return res.json();
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
    }
  };

  // Check if user has sent first message
  const hasUserMessages =
    messages.filter((msg) => msg.sender === "user").length > 0;

  // Show loading indicator while loading chat history
  if (isLoading) {
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
          Loading chat history...
        </Typography>
      </Box>
    );
  }

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
        }}
      >
        {/* Sidebar */}
        {sidebarOpen && (
          <Sidebar onClose={handleSidebarClose} currentPersonaId={persona.id} />
        )}

        {/* Main chat area wrapper */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            transition: "margin-left 0.3s cubic-bezier(.4,0,.2,1)",
            ml: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0,
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

                {/* Role */}
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
              </Box>

              {/* Messages */}
              {messages.map((msg, idx) =>
                msg.sender === "ai" ? (
                  <Box
                    key={idx}
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-end",
                        gap: 2,
                      }}
                    >
                      <Avatar sx={{ width: 42, height: 42, mb: 0.5 }}>
                        <img
                          src={persona.avatar}
                          alt="AI"
                          style={{ width: 48, height: 48, borderRadius: "50%" }}
                          onError={(e) => {
                            console.error("AI message avatar failed to load:", persona.avatar);
                            console.error("Error event:", e);
                          }}
                          onLoad={() => {
                            console.log("AI message avatar loaded successfully:", persona.avatar);
                          }}
                        />
                      </Avatar>
                      <Box>
                        <Box
                          sx={{
                            color: "#52946B",
                            fontWeight: 500,
                            fontSize: 16,
                            mb: 1,
                            fontFamily:
                              "Inter, Roboto, Helvetica, Arial, sans-serif",
                          }}
                        >
                          {persona.name}
                        </Box>
                        <Box
                          sx={{
                            bgcolor: "#F0F5F2",
                            color: "#4e5357",
                            px: { xs: 2.5, sm: 2 },
                            py: { xs: 2, sm: 2.5 },
                            borderRadius: 3,
                            fontSize: 16,
                            fontWeight: 400,
                            maxWidth: { xs: "100%", sm: 600 },
                            wordBreak: "break-word",
                            boxShadow: "none",
                            lineHeight: 1.5,
                            fontFamily:
                              "Inter, Roboto, Helvetica, Arial, sans-serif",
                            textAlign: "left",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {msg.isTyping ? (
                            <TypingIndicator />
                          ) : msg.text.match(/(\n\s*[-*]|^\d+\.|^#)/m) ? (
                            <FormattedOutput content={msg.text} />
                          ) : (
                            msg.text
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box
                    key={idx}
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                      mb: 2,
                      mr: { xs: 0, sm: 4 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row-reverse",
                        alignItems: "flex-end",
                        gap: 2,
                      }}
                    >
                      <Avatar sx={{ width: 42, height: 42, mb: 0.5 }}>
                        {userAvatar ? (
                          <img
                            src={userAvatar}
                            alt="User"
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 18,
                              fontWeight: 500,
                              color: "#fff",
                            }}
                          >
                            U
                          </span>
                        )}
                      </Avatar>
                      <Box
                        sx={{
                          bgcolor: "#00875A",
                          color: "#fff",
                          px: { xs: 2.5, sm: 3 },
                          py: { xs: 2, sm: 2.5 },
                          borderRadius: 3,
                          fontSize: 16,
                          fontWeight: 400,
                          maxWidth: { xs: "100%", sm: 400 },
                          wordBreak: "break-word",
                          boxShadow: "0 2px 8px rgba(44,62,80,0.04)",
                          lineHeight: 1.5,
                          fontFamily:
                            "Inter, Roboto, Helvetica, Arial, sans-serif",
                          textAlign: "start",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {msg.text}
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
            {!hasUserMessages && (
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 1, sm: 2 },
                  maxWidth: sidebarOpen
                    ? { xs: "100%", sm: `calc(1120px - ${SIDEBAR_WIDTH}px)` }
                    : { xs: "100%", sm: 960 },
                  width: "100%",
                  px: { xs: 2, sm: 3 },
                  mb: 0,
                  mt: 0,
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                }}
              >
                {suggestionChips.map((label, idx) => (
                  <Chip
                    key={idx}
                    label={label}
                    onClick={() => {
                      setMessageInput(label);
                      // Auto-send the message after setting it
                      setTimeout(() => handleSendMessage(), 100);
                    }}
                    sx={{
                      bgcolor: "#e8f5e8",
                      fontWeight: 500,
                      fontSize: { xs: 13, sm: 15 },
                      height: { xs: 32, sm: 36 },
                      mb: { xs: 1, sm: 0 },
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "#d4edd4",
                      },
                    }}
                  />
                ))}
              </Box>
            )}

            {/* Chat Input */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                maxWidth: sidebarOpen
                  ? { xs: "100%", sm: `calc(1120px - ${SIDEBAR_WIDTH}px)` }
                  : { xs: "100%", sm: 960 },
                width: "100%",
                px: { xs: 2, sm: 3 },
                mt: { xs: 2, sm: 3 },
              }}
            >
              {/* Single integrated chat input bar */}
              <Paper
                component="form"
                onSubmit={handleSendMessage}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                  borderRadius: "24px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  bgcolor: "#e8f5e8",
                  p: { xs: 1.5, sm: 2 },
                  border: "1px solid #d0d7de",
                  minHeight: { xs: 60, sm: 70 },
                }}
                elevation={0}
              >
                {/* Main input field - takes up most space */}
                <InputBase
                  sx={{
                    flex: 1,
                    fontSize: { xs: 14, sm: 16 },
                    mr: 2,
                    "& input": {
                      fontSize: { xs: 14, sm: 16 },
                      py: 0.5,
                    },
                    "& textarea": {
                      fontSize: { xs: 14, sm: 16 },
                      resize: "none",
                      lineHeight: 1.4,
                      py: 0.5,
                    },
                  }}
                  placeholder="Send a message"
                  inputProps={{ "aria-label": "send a message" }}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  autoFocus
                  multiline
                  maxRows={4}
                  minRows={1}
                />

                {/* Send button - aligned with text */}
                <IconButton
                  sx={{
                    backgroundColor: messageInput.trim()
                      ? "#00875A"
                      : "#d1d5db",
                    color: messageInput.trim() ? "white" : "#6b7280",
                    width: { xs: 36, sm: 40 },
                    height: { xs: 36, sm: 40 },
                    borderRadius: "50%",
                    transition: "all 0.2s ease",
                    flexShrink: 0,
                    "&:hover": {
                      backgroundColor: messageInput.trim()
                        ? "#1b5e20"
                        : "#d1d5db",
                      transform: messageInput.trim() ? "scale(1.05)" : "none",
                    },
                  }}
                  onClick={() => handleSendMessage()}
                  disabled={!messageInput.trim()}
                >
                  <IoSend size={16} />
                </IconButton>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
