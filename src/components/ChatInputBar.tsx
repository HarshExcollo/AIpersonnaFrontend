import React, { useRef, useState } from "react";
import { Box, IconButton, Paper, InputBase, Chip, Menu, MenuItem } from "@mui/material";
import { IoSend } from "react-icons/io5";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import type { Persona } from "../types";
import CircularProgress from '@mui/material/CircularProgress';
import { useDropzone } from 'react-dropzone';
import DriveFolderIcon from '@mui/icons-material/DriveFolderUpload';

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<(string | null)[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Handle input change
  const handleInputChange = (newValue: string) => {
    onChange?.(newValue);
  };

  // Handle send message (with file upload)
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = value.trim();
    if ((!trimmed && selectedFiles.length === 0) || disabled) return;

    let fileUrls: string[] = [];
    let fileTypes: string[] = [];
    if (selectedFiles.length > 0) {
      setUploading(true);
      try {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append('uploadedImages', file));
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas/upload`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.files)) {
          fileUrls = data.files.map((f: any) => f.fileUrl);
          fileTypes = data.files.map((f: any) => f.fileType);
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

    // Pass fileUrls and fileTypes to onSend if present
    if (onSend) {
      // For backward compatibility, send only the first file if only one, else send arrays
      if (fileUrls.length <= 1) {
        onSend({ message: trimmed, fileUrl: fileUrls[0], fileType: fileTypes[0] });
      } else {
        // @ts-ignore
        onSend({ message: trimmed, fileUrls, fileTypes });
      }
    }
    setSelectedFiles([]);
    setFilePreviewUrls([]);
    if (onChange) onChange("");
  };

  // Handle file upload
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    let newFiles: File[] = Array.from(files);
    // Limit to 5 files
    if (selectedFiles.length + newFiles.length > 5) {
      alert('You can upload up to 5 files per message.');
      return;
    }
    // Validate file size (max 20MB each)
    for (const file of newFiles) {
      if (file.size > 20 * 1024 * 1024) {
        alert('File size exceeds 20MB limit.');
        return;
      }
    }
    const allFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(allFiles);
    setFilePreviewUrls(allFiles.map(f => f.type.startsWith('image/') ? URL.createObjectURL(f) : null));
  };

  // Remove selected file
  const handleRemoveFile = (idx: number) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...filePreviewUrls];
    newFiles.splice(idx, 1);
    newPreviews.splice(idx, 1);
    setSelectedFiles(newFiles);
    setFilePreviewUrls(newPreviews);
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

  // Dropzone logic
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      let newFiles: File[] = acceptedFiles;
      if (selectedFiles.length + newFiles.length > 5) {
        alert('You can upload up to 5 files per message.');
        return;
      }
      for (const file of newFiles) {
        if (file.size > 20 * 1024 * 1024) {
          alert('File size exceeds 20MB limit.');
          return;
        }
      }
      const allFiles = [...selectedFiles, ...newFiles];
      setSelectedFiles(allFiles);
      setFilePreviewUrls(allFiles.map(f => f.type.startsWith('image/') ? URL.createObjectURL(f) : null));
    }
  }, [selectedFiles]);
  const {
    getRootProps,
    getInputProps,
    isDragActive
  } = useDropzone({ onDrop, multiple: true, noClick: true as any });

  // Google Picker constants (replace with your real values)
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
  const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY";

  // Google Picker logic
  let oauthToken: string | null = null;
  let pickerApiLoaded = false;

  function onAuthApiLoad() {
    window.gapi.auth.authorize(
      {
        'client_id': GOOGLE_CLIENT_ID,
        'scope': ['https://www.googleapis.com/auth/drive.readonly'],
        'immediate': false
      },
      handleAuthResult
    );
  }

  function onPickerApiLoad() {
    pickerApiLoaded = true;
  }

  function handleAuthResult(authResult: any) {
    if (authResult && !authResult.error) {
      oauthToken = authResult.access_token;
      createPicker();
    }
  }

  function createPicker() {
    if (pickerApiLoaded && oauthToken) {
      const picker = new window.google.picker.PickerBuilder()
        .addView(window.google.picker.ViewId.DOCS)
        .setOAuthToken(oauthToken)
        .setDeveloperKey(GOOGLE_API_KEY)
        .setCallback(pickerCallback)
        .build();
      picker.setVisible(true);
    }
  }

  function pickerCallback(data: any) {
    if (data.action === window.google.picker.Action.PICKED) {
      const file = data.docs[0];
      // For images, use file.url; for others, use file.url or file.embedUrl
      if (file && file.url) {
        // Call onSend with the file URL (as an image or file link)
        if (file.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
          // Image
          if (typeof window.onSendFromDrive === 'function') {
            window.onSendFromDrive({ fileUrl: file.url, fileType: file.mimeType });
          }
        } else {
          // Other file types: send as a link
          if (typeof window.onSendFromDrive === 'function') {
            window.onSendFromDrive({ message: file.name + ': ' + file.url });
          }
        }
      }
    }
  }

  const openGooglePicker = () => {
    if (!window.gapi) {
      alert('Google API not loaded.');
      return;
    }
    window.gapi.load('auth', { callback: onAuthApiLoad });
    window.gapi.load('picker', { callback: onPickerApiLoad });
  };

  // Attach a global handler for Google Picker callback
  (window as any).onSendFromDrive = (fileObj: any) => {
    if (onSend) onSend(fileObj);
  };

  const handleClipClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLocalUpload = () => {
    handleMenuClose();
    fileInputRef.current?.click();
  };

  const handleGoogleDrive = () => {
    handleMenuClose();
    openGooglePicker();
  };

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
      {...getRootProps({})}
    >
      <input {...getInputProps({})} />
      {isDragActive && (
        <Box sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          zIndex: 100,
          bgcolor: 'rgba(90,200,150,0.12)',
          border: '2px dashed #059134',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#059134',
          fontSize: 22,
          fontWeight: 600,
        }}>
          Drop files here to attach
        </Box>
      )}
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
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileChange}
          multiple
        />
        {/* File preview (if any) */}
        {selectedFiles.length > 0 && (
          <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
            ml: 2,
            maxWidth: 220,
          }}>
            {selectedFiles.map((file, idx) => (
              filePreviewUrls[idx] ? (
                // Image preview: only thumbnail, 2 per row
                <Box key={idx} sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                  mr: (idx % 2 === 1) ? 0 : 1.5,
                  mb: 1.5,
                  display: 'inline-block',
                }}>
                  <Box
                    component="img"
                    src={filePreviewUrls[idx] as string}
                    alt="preview"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveFile(idx)}
                    sx={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      bgcolor: 'rgba(255,255,255,0.7)',
                      color: '#333',
                      p: 0.2,
                      zIndex: 2,
                      '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
                    }}
                  >
                    ×
                  </IconButton>
                </Box>
              ) : (
                // Non-image: show as chip
                <Chip
                  key={idx}
                  label={file.name}
                  onDelete={() => handleRemoveFile(idx)}
                  sx={{ bgcolor: "#e8f5e8", fontWeight: 500 }}
                />
              )
            ))}
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
              onClick={handleClipClick}
              disabled={disabled}
              title="Attach file"
            >
              <AttachFileIcon sx={{ fontSize: 20 }} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleLocalUpload}>Upload from device</MenuItem>
              <MenuItem onClick={handleGoogleDrive}>Pick from Google Drive</MenuItem>
            </Menu>

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
