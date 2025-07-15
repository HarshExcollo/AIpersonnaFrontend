import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  IconButton,
  Avatar,
  InputAdornment,
  Button,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Dialog,
} from "@mui/material";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { CiSearch, CiSettings } from "react-icons/ci";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

import Popover from "@mui/material/Popover";
import ListItemIcon from "@mui/material/ListItemIcon";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsPage from "../../pages/SettingsPage";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
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
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const handleSettingsOpen = () => setSettingsOpen(true);
  const handleSettingsClose = () => setSettingsOpen(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Detect if we are on the Discover page
  const isDiscoverPage = location.pathname === "/";

  return (
    <AppBar
      position="relative"
      elevation={0}
      sx={{
        backgroundColor: "#fff",
        color: "#333",
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
        {/* Left section - Back Button, Logo and Chat */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}
        >
          {/* Show back button except on Discover page */}
          {!isDiscoverPage && (
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: "#222",
                borderRadius: 2,
                mr: 1,
              }}
            >
              {/* MUI Left Arrow Icon */}
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="#222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </IconButton>
          )}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: "#333",
              fontSize: { xs: "16px", sm: "18px" },
            }}
          >
            Pine Labs
          </Typography>
        </Box>

        {/* Right section - Navigation, Search, Settings and Profile */}
        <Box
          sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}
        >
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              sx={{ color: "#666", mr: 1 }}
              onClick={handleMobileMenuToggle}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Navigation buttons and Search (hidden on mobile) */}
          {!isMobile && (
            <>
              <Stack direction="row" sx={{ mr: 2 }}>
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
                      location.pathname === "/chat-history"
                        ? "#059134"
                        : "#666",
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

              <TextField
                placeholder="Search"
                variant="outlined"
                size="small"
                sx={{
                  width: 200,
                  mr: 2,
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#E8F2ED",
                    borderRadius: 2,
                    "& fieldset": {
                      border: "none",
                    },
                    "&:hover fieldset": {
                      border: "none",
                    },
                    "&.Mui-focused fieldset": {
                      border: "1px solid #059134",
                    },
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    color: "#059134",
                    opacity: 1,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CiSearch size={20} color="#059134" />
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}

          {/* Settings Icon */}
          <IconButton onClick={handleSettingsOpen} sx={{ color: "#666" }}>
            <CiSettings size={isMobile ? 20 : 24} />
          </IconButton>
          <Dialog
            open={settingsOpen}
            onClose={handleSettingsClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 7,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              },
            }}
          >
            <SettingsPage />
          </Dialog>

          {/* Profile (always visible) */}
          <Button onClick={handleProfileClick} sx={{ minWidth: 0, p: 0.5 }}>
            <Avatar
              src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg?semt=ais_hybrid&w=740"
              sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}
            />
          </Button>

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
        </Box>
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            backgroundColor: "#fff",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#333", mb: 3 }}
          >
            Menu
          </Typography>

          <List>
            <ListItem
              button
              onClick={() => handleMobileNavigation("/")}
              sx={{
                backgroundColor:
                  location.pathname === "/" ? "#E8F2ED" : "transparent",
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemText
                primary="Discover"
                sx={{
                  "& .MuiListItemText-primary": {
                    color: location.pathname === "/" ? "#059134" : "#333",
                    fontWeight: location.pathname === "/" ? 600 : 400,
                  },
                }}
              />
            </ListItem>

            <ListItem
              button
              onClick={() => handleMobileNavigation("/chat-history")}
              sx={{
                backgroundColor:
                  location.pathname === "/chat-history"
                    ? "#E8F2ED"
                    : "transparent",
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemText
                primary="Chat History"
                sx={{
                  "& .MuiListItemText-primary": {
                    color:
                      location.pathname === "/chat-history"
                        ? "#059134"
                        : "#333",
                    fontWeight:
                      location.pathname === "/chat-history" ? 600 : 400,
                  },
                }}
              />
            </ListItem>

            <ListItem
              button
              onClick={() => handleMobileNavigation("/persona-selector")}
              sx={{
                backgroundColor:
                  location.pathname === "/persona-selector"
                    ? "#E8F2ED"
                    : "transparent",
                borderRadius: 1,
                mb: 1,
              }}
            >
              <ListItemText
                primary="Persona Selector"
                sx={{
                  "& .MuiListItemText-primary": {
                    color:
                      location.pathname === "/persona-selector"
                        ? "#059134"
                        : "#333",
                    fontWeight:
                      location.pathname === "/persona-selector" ? 600 : 400,
                  },
                }}
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <List>
            <ListItem
              button
              onClick={() => {
                setMobileMenuOpen(false);
                handleSettingsOpen();
              }}
            >
              <ListItemIcon>
                <CiSettings size={20} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <HelpOutlineIcon />
              </ListItemIcon>
              <ListItemText primary="Help & Support" />
            </ListItem>
            <Divider sx={{ my: 1 }} />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
