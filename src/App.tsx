import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Discovery from "./pages/Discovery";
import ChatPage from "./pages/ChatPage";
import type { Persona } from "./types";
import ChatHistoryPage from "./pages/ChatHistoryPage";
import SettingsPage from "./pages/SettingsPage";
import PersonaSelectorPage from "./pages/PersonaSelectorPage";
import ViewPersonaPage from "./pages/ViewPersonaPage";
import AuthPage from "./pages/AuthPage";
// import ForgotPasswordPage from "./pages/ForgotPasswordPage";
// import VerifyOtpPage from "./pages/VerifyOtpPage";
// import ResetPasswordPage from "./pages/ResetPasswordPage";
// import TwoFactorAuthPage from "./pages/TwoFactorAuthPage";
import RegisterPage from "./pages/RegisterPage";

// Create a responsive theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#2e7d32",
      light: "#e8f5e8",
      dark: "#1b5e20",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Auth guard for protected routes
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// Wrapper to use hooks in routed components
const DiscoveryWithNav: React.FC = () => {
  const navigate = useNavigate();
  const handleStartChat = (persona: Persona) => {
    navigate(`/chat/${persona.id}`);
  };
  return <Discovery onStartChat={handleStartChat} />;
};

const ViewPersonaPageWithParams: React.FC = () => {
  // No need to pass persona prop; ViewPersonaPage fetches data itself
  return <ViewPersonaPage />;
};

// Add this wrapper inside App.tsx
const ChatPageWithNav: React.FC = () => {
  const navigate = useNavigate();
  return <ChatPage onBack={() => navigate("/")} />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <DiscoveryWithNav />
              </RequireAuth>
            }
          />
          <Route
            path="/chat/:id"
            element={
              <RequireAuth>
                <ChatPageWithNav />
              </RequireAuth>
            }
          />
          <Route path="/chat-history" element={<ChatHistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/persona-selector" element={<PersonaSelectorPage />} />
          <Route
            path="/view-persona/:id"
            element={<ViewPersonaPageWithParams />}
          />
          {/* Auth routes */}
          {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/2fa" element={<TwoFactorAuthPage />} /> */}
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;