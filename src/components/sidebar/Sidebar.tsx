import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/PersonOutline";
import SearchIcon from "@mui/icons-material/Search";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useNavigate } from "react-router-dom";
import type { Persona } from "../../types";

const favoritePersonas = [
  {
    name: "David Lee",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Ethan Carter",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
  },
  {
    name: "Emily Carter",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];
const recentChats = ["Create User flow", "Design strategy", "Roadmap"];

const Sidebar: React.FC<{
  onClose?: () => void;
  currentPersonaId?: string;
}> = ({ onClose, currentPersonaId }) => {
  const navigate = useNavigate();
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

  // Handler for New Chat button
  const handleNewChat = () => {
    const defaultPersona = personas[0];
    if (defaultPersona) {
      navigate(`/chat/${defaultPersona.id}`);
      if (onClose) onClose();
    }
  };

  return (
    <Box
      sx={{
        width: { xs: 280, sm: 220 },
        height: "100vh",
        bgcolor: "#fff",
        p: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #e0e0e0",
        overflowY: "auto",
        overflowX: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1200, // Above main content, below header if needed
        mt: 0,
        pt: 0,
        // Hide scrollbar for all browsers
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari, Opera
      }}
    >
      {/* Header: back icon and Pine labs */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: { xs: 2, sm: 3 },
          px: 0,
          py: { xs: 1, sm: 1.5 },
          mt: { xs: 1, sm: 1.8 },
          pt: 0,
          pl: { xs: 1.5, sm: 2 },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            color: "#012A1F",
            fontSize: { xs: 24, sm: 28 },
            p: 0,
            minWidth: { xs: 40, sm: 32 },
            minHeight: { xs: 40, sm: 32 },
            mr: 0.2,
            fontWeight: 900,
          }}
        >
          <ChevronLeftIcon
            sx={{ fontSize: { xs: 24, sm: 28 }, color: "#012A1F" }}
          />
        </IconButton>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
            fontWeight: 700,
            fontSize: { xs: "16px", sm: "18px" },
            lineHeight: { xs: "20px", sm: "23px" },
            letterSpacing: 0,
            color: "#0D1A12",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            ml: { xs: 1, sm: 1.2 },
          }}
        >
          Pine labs
        </Typography>
      </Box>
      {/* New Chat Button */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          bgcolor: "#0A9969",
          color: "#fff",
          borderRadius: 3,
          fontWeight: 500,
          fontSize: { xs: 16, sm: 19 },
          py: { xs: 2.5, sm: 2.8 },
          mb: { xs: 1.5, sm: 1.9 },
          mt: { xs: 2, sm: 2.5 },
          boxShadow: "none",
          textTransform: "none",
          width: "100%",
          maxWidth: { xs: 240, sm: 160 },
          minWidth: 0,
          letterSpacing: 0.1,
          "&:hover": { bgcolor: "#059134" },
          ml: { xs: 1.5, sm: 1.7 },
          mr: { xs: 1.5, sm: 1 },
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        onClick={handleNewChat}
      >
        New chat
      </Button>
      {/* Menu Options */}
      <List
        sx={{
          mb: { xs: 2, sm: 2.5 },
          mx: { xs: 1.5, sm: 2 },
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <ListItem
          button
          sx={{ px: 0, mb: { xs: 1, sm: 1.2 }, minWidth: 0 }}
          onClick={() =>
            navigate(`/view-persona/${currentPersonaId || (personas[0] && personas[0].id)}`)
          }
        >
          <ListItemAvatar sx={{ minWidth: { xs: 40, sm: 32 } }}>
            <PersonIcon
              sx={{
                color: "#222",
                fontSize: { xs: 24, sm: 22 },
                marginTop: 0.5,
              }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                sx={{
                  fontWeight: 500,
                  color: "#222",
                  fontSize: { xs: 15, sm: 16 },
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                View Persona
              </Typography>
            }
          />
        </ListItem>
        <ListItem button sx={{ px: 0, minWidth: 0 }}>
          <ListItemAvatar sx={{ minWidth: { xs: 40, sm: 32 } }}>
            <SearchIcon
              sx={{
                color: "#222",
                fontSize: { xs: 24, sm: 22 },
                marginTop: 0.5,
              }}
            />
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography
                sx={{
                  fontWeight: 500,
                  color: "#222",
                  fontSize: { xs: 15, sm: 16 },
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Search Chats
              </Typography>
            }
          />
        </ListItem>
      </List>
      {/* Favorite Personas */}
      <List
        sx={{
          mb: { xs: 1.5, sm: 2 },
          mx: { xs: 1.5, sm: 2 },
          width: "100%",
          maxWidth: "100%",
        }}
        subheader={
          <ListSubheader
            component="div"
            disableSticky
            sx={{
              bgcolor: "transparent",
              fontWeight: 800,
              color: "#111",
              fontSize: { xs: 20, sm: 22 },
              letterSpacing: -1,
              px: 0,
              py: 0.1,
              mt: -1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Favorite Personas
          </ListSubheader>
        }
      >
        {favoritePersonas.map((p) => (
          <ListItem
            key={p.name}
            sx={{ px: 0, py: { xs: 1, sm: 1.2 }, minWidth: 0 }}
          >
            <ListItemAvatar sx={{ minWidth: { xs: 44, sm: 36 } }}>
              <Avatar
                src={p.avatar}
                sx={{
                  width: { xs: 36, sm: 32 },
                  height: { xs: 36, sm: 32 },
                  mr: 1,
                }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: "#222",
                    fontSize: { xs: 14, sm: 15 },
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {p.name}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
      {/* Recent Chats */}
      <List
        sx={{ mx: { xs: 1.5, sm: 2 }, width: "100%", maxWidth: "100%" }}
        subheader={
          <ListSubheader
            component="div"
            disableSticky
            sx={{
              bgcolor: "transparent",
              fontWeight: 800,
              color: "#111",
              fontSize: { xs: 20, sm: 22 },
              letterSpacing: -1,
              px: 0,
              py: 0.5,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Recent Chats
          </ListSubheader>
        }
      >
        {recentChats.map((chat) => (
          <ListItem
            key={chat}
            sx={{
              px: 0,
              py: { xs: 0.8, sm: 0.5 },
              minWidth: 0,
              alignItems: "center",
            }}
          >
            <ListItemAvatar
              sx={{
                minWidth: { xs: 44, sm: 36 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ChatBubbleOutlineIcon
                sx={{ color: "#093", fontSize: { xs: 24, sm: 22 }, mr: 0 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: "#222",
                    fontSize: { xs: 14, sm: 15 },
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    ml: 0,
                  }}
                >
                  {chat}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
