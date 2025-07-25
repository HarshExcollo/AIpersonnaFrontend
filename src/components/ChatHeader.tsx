import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Button,
  Stack,
  Dialog,
  useTheme,
  useMediaQuery,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { CiSettings } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SettingsPage from "../pages/SettingsPage";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutIcon from "@mui/icons-material/Logout";

interface ChatHeaderProps {
  onBack: () => void;
  onMenu?: () => void;
  isSidebarOpen?: boolean;
  backIcon?: React.ReactNode;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onBack,
  onMenu,
  isSidebarOpen,
  backIcon,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const SIDEBAR_WIDTH = 280; // Fixed width for consistent sidebar

  // Profile popover state and handlers
  const [profileAnchorEl, setProfileAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const profileOpen = Boolean(profileAnchorEl);
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };
  const handleLogout = () => {
    // TODO: Clear auth state if implemented
    handleProfileClose();
    navigate("/login");
  };

  return (
    <AppBar
      position="relative"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        color: "#333",
        boxShadow: "none",
        borderBottom: "1px solid #e9ecef",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 2, sm: 3 },
          minHeight: { xs: 56, sm: 64 },
        }}
      >
        {/* Left-side spacer when sidebar is open */}
        {isSidebarOpen && (
          <Box sx={{ width: `${SIDEBAR_WIDTH}px`, flexShrink: 0 }} />
        )}
        {/* Left section - Back and Menu, hidden when sidebar is open */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            transition: "margin-left 0.3s cubic-bezier(.4,0,.2,1)",
          }}
        >
          {!isSidebarOpen && (
            <>
              <IconButton
                size="small"
                onClick={onBack}
                sx={{
                  fontSize: { xs: 24, sm: 28 },
                  color: "#000",
                  fontWeight: 900,
                  fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
                  p: { xs: 0.8, sm: 1 },
                  mr: 0.2,
                  background: "none",
                  border: "none",
                  borderRadius: 0,
                  boxShadow: "none",
                  "&:hover": {
                    color: "#059134",
                    background: "none",
                  },
                }}
              >
                {typeof backIcon !== "undefined" ? backIcon : "<"}
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  color: "#000",
                  fontSize: { xs: 20, sm: 22 },
                  fontWeight: 900,
                  fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
                  p: { xs: 0.6, sm: 0.7 },
                  ml: 0.2,
                  background: "none",
                  border: "none",
                  borderRadius: 0,
                  boxShadow: "none",
                  "&:hover": {
                    color: "#059134",
                    background: "none",
                  },
                }}
                onClick={onMenu}
              >
                <MenuIcon
                  sx={{ fontSize: { xs: 20, sm: 22 }, fontWeight: 900 }}
                />
              </IconButton>
            </>
          )}
        </Box>

        {/* Center section - Spacer (matches Discover header) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            flex: 1,
            mx: { xs: 2, sm: 4 },
          }}
        ></Box>

        {/* Right section - Navigation, Settings, Avatar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
          }}
        >
          {/* Hide navigation buttons on mobile */}
          {!isMobile && (
            <Stack direction="row">
              <Button
                sx={{
                  color: location.pathname === "/" ? "#059134" : "#666",
                  fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: "24px",
                  letterSpacing: 0,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#059134",
                  },
                }}
                onClick={() => navigate("/")}
              >
                Discover
              </Button>
              <Button
                sx={{
                  color:
                    location.pathname === "/chat-history" ? "#059134" : "#666",
                  fontFamily: "Inter, Roboto, Helvetica, Arial, sans-serif",
                  fontWeight: 500,
                  fontSize: "16px",
                  lineHeight: "24px",
                  letterSpacing: 0,
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    color: "#059134",
                  },
                }}
                onClick={() => navigate("/chat-history")}
              >
                Chat History
              </Button>
            </Stack>
          )}
          {(() => {
            const [settingsOpen, setSettingsOpen] = React.useState(false);
            const handleSettingsOpen = () => setSettingsOpen(true);
            const handleSettingsClose = () => setSettingsOpen(false);
            return (
              <>
                <IconButton sx={{ color: "#666" }} onClick={handleSettingsOpen}>
                  <CiSettings size={isMobile ? 20 : 24} />
                </IconButton>
                <Dialog
                  open={settingsOpen}
                  onClose={handleSettingsClose}
                  maxWidth="md"
                  fullWidth
                  fullScreen={isMobile}
                >
                  <SettingsPage />
                </Dialog>
              </>
            );
          })()}
          <Button onClick={handleProfileClick} sx={{ minWidth: 0, p: 0.5 }}>
            <Avatar
              src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740"
              sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}
            />
          </Button>
        </Box>
      </Toolbar>

      {/* Profile Popover */}
      <Popover
        open={profileOpen}
        anchorEl={profileAnchorEl}
        onClose={handleProfileClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            borderRadius: 3,
          },
        }}
      >
        <List sx={{ py: 0 }}>
          <ListItem button>
            <ListItemIcon>
              <HelpOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Help & Support" />
          </ListItem>
          <Divider />
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Popover>
    </AppBar>
  );
};

export default ChatHeader;
