import React, { useEffect, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface ViewPersonaHeaderProps {
  avatar: string;
  name: string;
  role: string;
  onStartChat: () => void;
}

const ViewPersonaHeader: React.FC<ViewPersonaHeaderProps> = ({
  avatar,
  name,
  role,
  onStartChat,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  // Get personaId from window.location or props
  const personaId = window.location.pathname.split("/").pop();

  // Fetch favorite status on mount
  useEffect(() => {
    const fetchFavorite = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/favorites`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.favorites)) {
          setIsFavorite(data.favorites.includes(personaId));
        }
      } catch (err) {
        // Ignore
      }
    };
    if (personaId) fetchFavorite();
  }, [personaId]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleFavorite = async () => {
    if (!personaId) return;
    setLoadingFavorite(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ personaId }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.favorites)) {
        setIsFavorite(data.favorites.includes(personaId));
      }
    } catch (err) {
      // Ignore
    }
    setLoadingFavorite(false);
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 4,
        mb: 1,
        mt: -1.5,
        flexWrap: { xs: "wrap", sm: "nowrap" },
      }}
    >
      <Avatar src={avatar} sx={{ width: 100, height: 100, mt: 1.5 }} />
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{ fontWeight: 800, fontSize: 28, color: "#222", mb: 0.5 }}
        >
          {name}
        </Typography>
        <Typography
          sx={{ color: "#219653", fontWeight: 500, fontSize: 18, mb: 1 }}
        >
          {role}
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }} />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: { xs: 2, sm: 0 },
        }}
      >
        <Button
          variant="contained"
          sx={{
            bgcolor: "#059134",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            borderRadius: 2,
            px: 3,
            py: 0.7,
            minHeight: 36,
            boxShadow: "none",
            textTransform: "none",
            "&:hover": { bgcolor: "#047a2b" },
          }}
          onClick={onStartChat}
        >
          Start Chat
        </Button>
        <IconButton sx={{ ml: 1 }} onClick={handleMenuOpen}>
          <MoreVertIcon sx={{ fontSize: 28, color: "#222" }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleToggleFavorite} disabled={loadingFavorite}>
            {isFavorite ? (
              <FavoriteIcon sx={{ mr: 1, color: "#e53935" }} />
            ) : (
            <FavoriteBorderIcon sx={{ mr: 1 }} />
            )}
            {isFavorite ? "Unmark as favourite" : "Mark as favourite"}
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default ViewPersonaHeader;
