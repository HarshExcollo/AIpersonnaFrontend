import React, { useRef, useState } from "react";
import { Box, IconButton, Paper, InputBase, Chip } from "@mui/material";
import { IoSend } from "react-icons/io5";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import type { Persona } from "../types";

interface ChatInputBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (message: string) => void;
  onFileUpload?: (file: File) => void;
  placeholder?: string;
  suggestions?: string[];
  showSuggestions?: boolean;
  disabled?: boolean;
  persona?: Persona;
  sidebarOpen?: boolean;
  sidebarWidth?: number;
  maxWidth?: number | string;
}

const ChatInputBar: React.FC<ChatInputBarProps> = ({
  value = "",
  onChange,
  onSend,
  onFileUpload,
  placeholder = "Send a message",
  suggestions = [],
  showSuggestions = false,
  disabled = false,
  persona,
  sidebarOpen = false,
  sidebarWidth = 160,
  maxWidth = 960,
}) => {
  const [messageInput, setMessageInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle input change
  const handleInputChange = (newValue: string) => {
    setMessageInput(newValue);
    onChange?.(newValue);
  };

  // Handle send message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = messageInput.trim();
    if (!trimmed || disabled) return;

    onSend?.(trimmed);
    setMessageInput("");
    onChange?.("");
  };

  // Handle file upload
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setMessageInput(suggestion);
    onChange?.(suggestion);
    // Auto-send the message after setting it
    setTimeout(() => {
      onSend?.(suggestion);
      setMessageInput("");
      onChange?.("");
    }, 100);
  };

  // Get suggestion chips for persona
  const getSuggestionChips = (department: string, personaId?: string) => {
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

  const suggestionChips = React.useMemo(() => {
    if (suggestions.length > 0) {
      return suggestions;
    }
    if (persona) {
      return getSuggestionChips(persona.department, persona.id);
    }
    return [];
  }, [suggestions, persona]);

  return (
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
        background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 20%)",
      }}
    >
      {/* Suggestion Chips */}
      {showSuggestions && suggestionChips.length > 0 && (
        <Box
          sx={{
            display: "flex",
            gap: { xs: 1, sm: 2 },
            maxWidth: sidebarOpen
              ? { xs: "100%", sm: `calc(${maxWidth}px - ${sidebarWidth}px)` }
              : { xs: "100%", sm: maxWidth },
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
              onClick={() => handleSuggestionClick(label)}
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
            ? { xs: "100%", sm: `calc(${maxWidth}px - ${sidebarWidth}px)` }
            : { xs: "100%", sm: maxWidth },
          width: "100%",
          px: { xs: 2, sm: 3 },
          mt: { xs: 2, sm: 3 },
        }}
      >
        {/* File input (hidden) */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
        />

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
          {/* File upload button (optional) */}
          {onFileUpload && (
            <IconButton
              onClick={handleUploadClick}
              sx={{
                color: "#666",
                mr: 1,
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
              disabled={disabled}
            >
              <AttachFileIcon sx={{ fontSize: 20 }} />
            </IconButton>
          )}

          {/* Main input field */}
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
            placeholder={placeholder}
            inputProps={{ "aria-label": placeholder }}
            value={messageInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            autoFocus={!disabled}
            multiline
            maxRows={4}
            minRows={1}
            disabled={disabled}
          />

          {/* Send button */}
          <IconButton
            sx={{
              backgroundColor:
                messageInput.trim() && !disabled ? "#00875A" : "#d1d5db",
              color: messageInput.trim() && !disabled ? "white" : "#6b7280",
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              borderRadius: "50%",
              transition: "all 0.2s ease",
              flexShrink: 0,
              "&:hover": {
                backgroundColor:
                  messageInput.trim() && !disabled ? "#1b5e20" : "#d1d5db",
                transform:
                  messageInput.trim() && !disabled ? "scale(1.05)" : "none",
              },
            }}
            onClick={() => handleSendMessage()}
            disabled={!messageInput.trim() || disabled}
          >
            <IoSend size={16} />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatInputBar;
