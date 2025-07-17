import React, { useRef, useState } from "react";
import { Box, IconButton, Paper, InputBase, Chip } from "@mui/material";
import { IoSend } from "react-icons/io5";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import type { Persona } from "../types";
import CircularProgress from '@mui/material/CircularProgress';

interface ChatInputBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSend?: (msgObj: { message: string; fileUrl?: string; fileType?: string }) => void;
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
  placeholder = "Send a message",
  suggestions = [],
  showSuggestions = false,
  disabled = false,
  persona,
  sidebarOpen = false,
  sidebarWidth = 160,
  maxWidth = 960,
}) => {
  // Remove internal messageInput state; use value prop directly
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle input change
  const handleInputChange = (newValue: string) => {
    onChange?.(newValue);
  };

  // Handle send message (with file upload)
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = value.trim();
    if ((!trimmed && !selectedFile) || disabled) return;

    let fileUrl = undefined;
    let fileType = undefined;
    if (selectedFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          fileUrl = data.fileUrl;
          fileType = data.fileType;
        } else {
          alert('File upload failed: ' + data.message);
          setUploading(false);
          return;
        }
      } catch {
        alert('File upload error.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // Pass fileUrl and fileType to onSend if present
    if (onSend) {
      onSend({ message: trimmed, fileUrl, fileType });
    }
    setSelectedFile(null);
    setFilePreviewUrl(null);
    if (onChange) onChange("");
  };

  // Handle file upload
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      alert('File size exceeds 20MB limit.');
      return;
    }
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      setFilePreviewUrl(URL.createObjectURL(file));
    } else {
      setFilePreviewUrl(null);
    }
  };

  // Remove selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    if (onChange) onChange(suggestion);
    // Do NOT auto-send the message
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
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
        {/* File preview */}
        {selectedFile && (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            {filePreviewUrl ? (
              <img src={filePreviewUrl} alt="preview" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, marginRight: 8 }} />
            ) : (
              <span style={{ marginRight: 8 }}>{selectedFile.name}</span>
            )}
            <IconButton size="small" onClick={handleRemoveFile} disabled={uploading}>
              ✕
            </IconButton>
            {uploading && <CircularProgress size={20} sx={{ ml: 1 }} />}
          </Box>
        )}

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
          {/* File upload button (always visible) */}
            <IconButton
              onClick={handleUploadClick}
              sx={{
                mr: 1,
              backgroundColor: "transparent !important",
                "&:hover": {
                backgroundColor: "transparent !important",
              },
              "&:focus": {
                backgroundColor: "transparent !important",
                },
              }}
              disabled={disabled}
            disableRipple
            disableFocusRipple
            >
              <AttachFileIcon sx={{ fontSize: 20 }} />
            </IconButton>

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
            value={value}
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
                value.trim() && !disabled ? "#00875A" : "#d1d5db",
              color: value.trim() && !disabled ? "white" : "#6b7280",
              width: { xs: 36, sm: 40 },
              height: { xs: 36, sm: 40 },
              borderRadius: "50%",
              transition: "all 0.2s ease",
              flexShrink: 0,
              "&:hover": {
                backgroundColor:
                  value.trim() && !disabled ? "#1b5e20" : "#d1d5db",
                transform:
                  value.trim() && !disabled ? "scale(1.05)" : "none",
              },
            }}
            onClick={() => handleSendMessage()}
            disabled={!value.trim() || disabled}
          >
            <IoSend size={16} />
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatInputBar;
