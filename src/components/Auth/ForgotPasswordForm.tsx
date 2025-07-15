import React, { useState } from "react";
import { Box, Typography, TextField, Button, Link } from "@mui/material";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff' }}>
      {/* Left: Form or Confirmation */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', px: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 370 }}>
          {!emailSent ? (
            <>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: '#222' }}>Forgot Password</Typography>
              <Typography sx={{ color: '#6b7280', fontWeight: 500, fontSize: 16, mb: 3 }}>
                No worries, we'll send a recovery link to your email.
              </Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 1, color: '#222' }}>Email</Typography>
              <TextField
                fullWidth
                placeholder="Enter email"
                variant="outlined"
                value={email}
                onChange={e => setEmail(e.target.value)}
                sx={{ mb: 3, borderRadius: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
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
                  mb: 3,
                  boxShadow: 'none',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#12805a' },
                }}
                onClick={() => setEmailSent(true)}
                disabled={!email}
              >
                Send a recovery link
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <Typography sx={{ color: '#6b7280', fontWeight: 500, fontSize: 16 }}>
                  Back to
                </Typography>
                <Link href="/auth" underline="none" sx={{ color: '#219653', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                  Login
                </Link>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: '#222' }}>Password recovery</Typography>
              <Typography sx={{ fontWeight: 700, fontSize: 18, color: '#222', mb: 1.5 }}>Check your email</Typography>
              <Typography sx={{ color: '#6b7280', fontWeight: 500, fontSize: 16, mb: 0.5 }}>
                We have sent a password reset link to
              </Typography>
              <Typography sx={{ color: '#6b7280', fontWeight: 700, fontSize: 16, mb: 3 }}>{email || "email@email.com"}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 4 }}>
                <Link component="button" underline="none" sx={{ color: '#222', fontWeight: 700, fontSize: 16, cursor: 'pointer', p: 0 }} onClick={() => setEmailSent(false)}>
                  Resend e-mail
                </Link>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Typography sx={{ color: '#6b7280', fontWeight: 500, fontSize: 16 }}>
                    Back to
                  </Typography>
                  <Link href="/auth" underline="none" sx={{ color: '#219653', fontWeight: 700, fontSize: 16, cursor: 'pointer', p: 0 }}>
                    Login
                  </Link>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
      {/* Right: Image only, no caption */}
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

export default ForgotPasswordForm; 