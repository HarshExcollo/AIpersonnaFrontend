import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import AppleIcon from "@mui/icons-material/Apple";
import { useNavigate, useLocation } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for registration success message
    const message = location.state?.message;
    if (message) {
      setSuccess(message);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store the token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Login successful - redirect to Discovery page
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
      {/* Left: Form */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', px: 4, maxWidth: 480 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 370 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 4, color: '#222' }}>Log in</Typography>
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 1, color: '#222' }}>Email</Typography>
          <TextField
            fullWidth
            name="email"
            type="email"
            placeholder="Your email"
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            required
            sx={{ mb: 2, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 1, color: '#222' }}>Password</Typography>
          <TextField
            fullWidth
            name="password"
            placeholder="Your password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            sx={{ mb: 1, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((v) => !v)} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              bgcolor: '#159c6b',
              color: '#fff',
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 2,
              py: 1.5,
              mb: 3,
              boxShadow: 'none',
              textTransform: 'none',
              '&:hover': { bgcolor: '#12805a' },
            }}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
            <IconButton sx={{ p: 1.2 }}>
              <Box component="img" src="https://th.bing.com/th?q=Google+Login+Logo.png&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&dpr=1.5&pid=InlineBlock&rm=3&mkt=en-IN&cc=IN&setlang=en&adlt=moderate&t=1&mw=247" alt="Google" sx={{ width: 28, height: 28, objectFit: 'contain' }} />
            </IconButton>
            <IconButton sx={{ p: 1.2 }}>
              <AppleIcon sx={{ fontSize: 32, color: '#222' }} />
            </IconButton>
            <IconButton sx={{ p: 1.2 }}>
              <Box component="img" src="https://th.bing.com/th/id/OIP.swFnAmrkP4rAX8Od0GNpnwHaHw?pid=ImgDet&w=178&h=186&c=7&dpr=1.5" alt="Twitter" sx={{ width: 28, height: 28, objectFit: 'contain' }} />
            </IconButton>
            <IconButton sx={{ p: 1.2, bgcolor: '#fff' }}>
              {/* Empty for spacing, matches Figma */}
            </IconButton>
          </Box>
          <Typography sx={{ textAlign: 'center', color: '#444', fontWeight: 500, fontSize: 16, mt: 1 }}>
            Don't have an account?{' '}
            <Button 
              sx={{ 
                color: '#1a237e', 
                fontWeight: 700, 
                fontSize: 16, 
                textTransform: 'none', 
                p: 0, 
                minWidth: 0 
              }} 
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm; 