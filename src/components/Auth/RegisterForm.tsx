import React, { useState } from "react";
import { Box, Typography, TextField, Button, InputAdornment, IconButton, Checkbox, FormControlLabel, Link, Alert } from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import TermsAndConditionsDialog from "./TermsAndConditionsDialog";
import { useNavigate } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms and Conditions");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Registration successful
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxClick = (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent) => {
    e.preventDefault();
    if (agreed) {
      setAgreed(false);
    } else {
      setTermsOpen(true);
    }
  };

  const handleAgree = () => {
    setAgreed(true);
    setTermsOpen(false);
  };

  const handleClose = () => {
    setTermsOpen(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        {/* Left: Form */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', px: 4, maxWidth: 480 }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 370 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2.5, color: '#222', textAlign: 'left' }}>Create Account</Typography>
            <Typography sx={{ color: '#6b7280', fontWeight: 500, fontSize: 16, mb: 3, textAlign: 'left', lineHeight: 1.3 }}>
              Fill your information below or register with your social account
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 1, color: '#222' }}>Username</Typography>
            <TextField
              fullWidth
              name="username"
              placeholder="Your username"
              variant="outlined"
              value={formData.username}
              onChange={handleChange}
              required
              sx={{ mb: 2, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
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
              sx={{ mb: 2, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(v => !v)} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={agreed}
                  onClick={handleCheckboxClick}
                  onChange={handleCheckboxClick}
                  sx={{ p: 0.5, mr: 1 }}
                />
              }
              label={<Typography sx={{ fontSize: 14, color: '#222', fontWeight: 400 }}>
                I agree with{' '}
                <Link href="#" underline="always" sx={{ color: '#159c6b', fontWeight: 500, cursor: 'pointer' }} onClick={e => e.preventDefault()}>
                  Privacy Policy and Terms and Conditions
                </Link>
              </Typography>}
              sx={{ mb: 3, alignItems: 'flex-start', '.MuiFormControlLabel-label': { mt: 0.2 } }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!agreed || loading}
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
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>
            <Typography sx={{ color: '#8a8a8a', fontSize: 16, fontWeight: 400, textAlign: 'left' }}>
              Already have an account?{' '}
              <Link href="#" underline="none" sx={{ color: '#222', fontWeight: 700, fontSize: 16, cursor: 'pointer' }} onClick={() => navigate('/login')}>
                Log in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
      <TermsAndConditionsDialog open={termsOpen} onClose={handleClose} onAgree={handleAgree} />
    </>
  );
};

export default RegisterForm; 