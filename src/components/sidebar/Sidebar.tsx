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

interface FavoritePersona {
  id: string;
  name: string;
  avatar: string;
  role?: string;
}

interface RecentChat {
  session_id: string;
  persona_id: string;
  persona_name: string;
  last_message: string;
  updated_at: string;
}

const Sidebar: React.FC<{
  onClose?: () => void;
  currentPersonaId?: string;
  onSearchChats?: () => void;
}> = ({ onClose, currentPersonaId, onSearchChats }) => {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [favoritePersonas, setFavoritePersonas] = useState<FavoritePersona[]>([]);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingRecents, setLoadingRecents] = useState(false);

  // Fetch all personas
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPersonas(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching personas:", error);
      });
  }, []);

  // Fetch user's favorite personas
  useEffect(() => {
    const fetchFavorites = async () => {
      setLoadingFavorites(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoadingFavorites(false);
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (data.success && Array.isArray(data.favorites)) {
          // Map favorite persona IDs to actual persona data
          const favoritePersonaData = data.favorites
            .map((personaId: string) => {
              const persona = personas.find(p => p.id === personaId);
              return persona ? {
                id: persona.id,
                name: persona.name,
                avatar: persona.avatar,
                role: persona.role
              } : null;
            })
            .filter(Boolean) as FavoritePersona[];
          
          setFavoritePersonas(favoritePersonaData);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setLoadingFavorites(false);
      }
    };

    if (personas.length > 0) {
      fetchFavorites();
    }
  }, [personas]);

  // Fetch user's recent chats for current persona
  useEffect(() => {
    const fetchRecentChats = async () => {
      if (!currentPersonaId) return;
      
      setLoadingRecents(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoadingRecents(false);
          return;
        }

        let userId = "current_user";
        try {
          const user = JSON.parse(localStorage.getItem("user") || "{}");
          userId = user.id || "current_user";
        } catch (error) {
          console.error("Error getting user ID:", error);
        }

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/personas/chats/recent?user=${userId}&persona=${currentPersonaId}&limit=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        
        if (data.success && Array.isArray(data.chats)) {
          setRecentChats(data.chats);
        }
      } catch (error) {
        console.error("Error fetching recent chats:", error);
      } finally {
        setLoadingRecents(false);
      }
    };

    fetchRecentChats();
  }, [currentPersonaId]);

  // Handler for New Chat button
  const handleNewChat = () => {
    const defaultPersona = personas[0];
    if (defaultPersona) {
      // Generate a unique session id for a new chat
      const sessionId = Date.now().toString();
      navigate(`/chat/${defaultPersona.id}?session=${sessionId}`);
      if (onClose) onClose();
    }
  };

  // Handler for favorite persona click
  const handleFavoritePersonaClick = (personaId: string) => {
    navigate(`/chat/${personaId}`);
    if (onClose) onClose();
  };

  // Handler for recent chat click
  const handleRecentChatClick = (chat: RecentChat) => {
    navigate(`/chat/${chat.persona_id}?session=${chat.session_id}`);
    if (onClose) onClose();
  };

  // Handler for search chats click
  const handleSearchChats = () => {
    // Trigger search modal in parent component
    if (onSearchChats) {
      onSearchChats();
    }
    // Close sidebar after opening search modal
    if (onClose) onClose();
  };

  return (
    <Box
      sx={{
        width: 280,
        height: "100vh",
        bgcolor: "#fff",
        p: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #e0e0e0",
        overflowY: "auto",
        overflowX: "hidden",
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
        disabled={personas.length === 0}
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
          width: "calc(100% - 32px)",
          minWidth: 0,
          letterSpacing: 0.1,
          "&:hover": { bgcolor: "#059134" },
          mx: 2,
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
        <ListItem 
          button 
          sx={{ px: 0, minWidth: 0 }}
          onClick={handleSearchChats}
        >
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
        {loadingFavorites ? (
          <ListItem sx={{ px: 0, py: { xs: 1, sm: 1.2 }, minWidth: 0 }}>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: "#888",
                    fontSize: { xs: 14, sm: 15 },
                    fontStyle: "italic",
                  }}
                >
                  Loading favorites...
                </Typography>
              }
            />
          </ListItem>
        ) : favoritePersonas.length > 0 ? (
          favoritePersonas.map((persona) => (
            <ListItem
              key={persona.id}
              button
              sx={{ px: 0, py: { xs: 1, sm: 1.2 }, minWidth: 0 }}
              onClick={() => handleFavoritePersonaClick(persona.id)}
            >
              <ListItemAvatar sx={{ minWidth: { xs: 44, sm: 36 } }}>
                <Avatar
                  src={persona.avatar}
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
                    {persona.name}
                  </Typography>
                }
                secondary={
                  persona.role && (
                    <Typography
                      sx={{
                        color: "#666",
                        fontSize: { xs: 12, sm: 13 },
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {persona.role}
                    </Typography>
                  )
                }
              />
            </ListItem>
          ))
        ) : (
          <ListItem sx={{ px: 0, py: { xs: 1, sm: 1.2 }, minWidth: 0 }}>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: "#888",
                    fontSize: { xs: 14, sm: 15 },
                    fontStyle: "italic",
                  }}
                >
                  No favorite personas yet
                </Typography>
              }
            />
          </ListItem>
        )}
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
        {loadingRecents ? (
          <ListItem sx={{ px: 0, py: { xs: 0.8, sm: 0.5 }, minWidth: 0 }}>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: "#888",
                    fontSize: { xs: 14, sm: 15 },
                    fontStyle: "italic",
                  }}
                >
                  Loading recent chats...
                </Typography>
              }
            />
          </ListItem>
        ) : recentChats.length > 0 ? (
          recentChats.map((chat) => (
            <ListItem
              key={`${chat.session_id}-${chat.persona_id}`}
              button
              sx={{
                px: 0,
                py: { xs: 0.8, sm: 0.5 },
                minWidth: 0,
                alignItems: "center",
              }}
              onClick={() => handleRecentChatClick(chat)}
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
                    {chat.persona_name}
                  </Typography>
                }
                secondary={
                  <Typography
                    sx={{
                      color: "#666",
                      fontSize: { xs: 12, sm: 13 },
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      ml: 0,
                    }}
                  >
                    {chat.last_message.length > 30 
                      ? `${chat.last_message.substring(0, 30)}...` 
                      : chat.last_message}
                  </Typography>
                }
              />
            </ListItem>
          ))
        ) : (
          <ListItem sx={{ px: 0, py: { xs: 0.8, sm: 0.5 }, minWidth: 0 }}>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: "#888",
                    fontSize: { xs: 14, sm: 15 },
                    fontStyle: "italic",
                  }}
                >
                  No recent chats with this persona
                </Typography>
              }
            />
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default Sidebar;
