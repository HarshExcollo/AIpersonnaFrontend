import React, { useState } from "react";
import { Box, Typography, TextField, Button, InputAdornment, IconButton } from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff' }}>
      {/* Left: Form */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', px: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 370 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: '#222', textAlign: 'center' }}>Reset Password</Typography>
          <Typography sx={{ color: '#6b7280', fontWeight: 500, fontSize: 16, mb: 3, textAlign: 'center' }}>
            Set the new password for your account so you can login and access all the features.
          </Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 1, color: '#222' }}>New Password</Typography>
          <TextField
            fullWidth
            placeholder="Enter new password"
            variant="outlined"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
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
          <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 1, color: '#222' }}>Confirm Password</Typography>
          <TextField
            fullWidth
            placeholder="Confirm new password"
            variant="outlined"
            type={showConfirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            sx={{ mb: 3, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(v => !v)} edge="end">
                    {showConfirm ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: '#159c6b',
              color: '#fff',
              fontWeight: 700,
              fontSize: 18,
              borderRadius: 2,
              py: 1.5,
              mb: 2,
              boxShadow: 'none',
              textTransform: 'none',
              '&:hover': { bgcolor: '#12805a' },
            }}
          >
            Reset Password
          </Button>
        </Box>
      </Box>
      {/* Right: Image and Caption */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: '#073b2a', height: '100vh', position: 'relative' }}>
        <Box
          component="img"
          src="https://th.bing.com/th/id/OIP.cFeKv_CFZJQcGRXPuj4neAHaEa?w=292&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3"
          alt="Pine Labs Devices"
          sx={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 0, boxShadow: 'none', background: 'transparent', maxHeight: '70%' }}
        />
      </Box>
    </Box>
  );
};

export default ResetPasswordForm; 