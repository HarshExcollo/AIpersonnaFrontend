import React from "react";
import { Box, Avatar, Typography, IconButton, Tooltip } from "@mui/material";
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

interface ChatHistoryItemProps {
  avatar: string;
  name: string;
  message: string;
  date: string;
  archived?: boolean;
  onClick?: () => void;
  onRightClick?: () => void;
  onArchive?: () => void;
  onUnarchive?: () => void;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  avatar,
  name,
  message,
  date,
  archived = false,
  onClick,
  onRightClick,
  onArchive,
  onUnarchive,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      py: 1.2,
      px: 0,
      borderRadius: 2,
      cursor: "pointer",
      "&:hover": { background: "#f5f8f6" },
      opacity: archived ? 0.7 : 1,
    }}
    onClick={onClick}
    onContextMenu={(e) => {
      e.preventDefault();
      if (onRightClick) {
        onRightClick();
      }
    }}
  >
    <Avatar src={avatar} sx={{ width: 48, height: 48, mr: 2, ml: 0.5 }} />
    <Box sx={{ flex: 1, minWidth: 0, ml: 0.5 }}>
      <Typography
        sx={{ fontWeight: 700, fontSize: 17, color: "#222", lineHeight: 1.1 }}
      >
        {name}
      </Typography>
      <Typography
        sx={{
          color: "#388e3c",
          fontWeight: 400,
          fontSize: 15,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 400,
        }}
      >
        {message}
      </Typography>
    </Box>
    <Typography
      sx={{
        color: "#7bb47b",
        fontWeight: 400,
        fontSize: 15,
        minWidth: 70,
        textAlign: "right",
        ml: 0,
        mr: 1,
      }}
    >
      {date}
    </Typography>
    {(onArchive || onUnarchive) && (
      <Tooltip title={archived ? "Unarchive" : "Archive"}>
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            if (archived && onUnarchive) {
              onUnarchive();
            } else if (!archived && onArchive) {
              onArchive();
            }
          }}
          sx={{
            color: archived ? "#7bb47b" : "#666",
            "&:hover": {
              color: archived ? "#388e3c" : "#333",
            },
          }}
        >
          {archived ? <UnarchiveIcon /> : <ArchiveIcon />}
        </IconButton>
      </Tooltip>
    )}
  </Box>
);

export default ChatHistoryItem;