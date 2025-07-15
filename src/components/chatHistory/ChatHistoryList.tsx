import React from "react";
import { Box } from "@mui/material";
import ChatHistoryItem from "./ChatHistoryItem";

export interface Chat {
  avatar: string;
  name: string;
  message: string;
  date: string;
  onClick?: () => void;
  onRightClick?: () => void;
}

interface ChatHistoryListProps {
  chats: Chat[];
  onSessionClick?: (index: number) => void;
}

const ChatHistoryList: React.FC<ChatHistoryListProps> = ({
  chats,
  onSessionClick,
}) => (
  <Box ml={2}>
    {chats.map((chat, idx) => (
      <Box key={idx} sx={{ mb: 0.5 }}>
        <ChatHistoryItem {...chat} />
      </Box>
    ))}
  </Box>
);

export default ChatHistoryList;