import React, { useState, useRef } from "react";
import { Box, Typography, TextField, Button, Link } from "@mui/material";

const OTP_LENGTH = 4;

const VerifyOtpForm: React.FC = () => {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const email = "Email@gmail.com";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;
    const newOtp = [...otp];
    newOtp[idx] = value.slice(-1);
    setOtp(newOtp);
    if (idx < OTP_LENGTH - 1 && value) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      const newOtp = [...otp];
      newOtp[idx - 1] = "";
      setOtp(newOtp);
      inputsRef.current[idx - 1]?.focus();
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#fff' }}>
      {/* Left: Form */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', px: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 370 }}>
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: '#222', textAlign: 'center' }}>Verify OTP</Typography>
          <Typography sx={{ color: '#6b7280', fontWeight: 500, fontSize: 16, mb: 1, textAlign: 'center' }}>
            Enter Verification Code
          </Typography>
          <Typography sx={{ color: '#219653', fontWeight: 700, fontSize: 16, mb: 3, textAlign: 'center' }}>{email}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            {otp.map((digit, idx) => (
              <TextField
                key={idx}
                inputRef={el => (inputsRef.current[idx] = el)}
                value={digit}
                onChange={e => handleChange(e, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                inputProps={{ maxLength: 1, style: { textAlign: 'center', fontSize: 28, fontWeight: 700, width: 48, height: 48, padding: 0 } }}
                sx={{
                  width: 48,
                  height: 48,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#fff',
                  },
                }}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 3 }}>
            <Typography sx={{ color: '#6b7280', fontWeight: 400, fontSize: 15 }}>Didn't receive code ?</Typography>
            <Link component="button" underline="none" sx={{ color: '#1a237e', fontWeight: 700, fontSize: 15, cursor: 'pointer', p: 0 }}>Resend</Link>
          </Box>
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
            Verify
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <Link href="/forgot-password" underline="none" sx={{ color: '#6b7280', fontWeight: 500, fontSize: 16, cursor: 'pointer', p: 0 }}>
              Go back
            </Link>
          </Box>
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
        <Typography sx={{ position: 'absolute', bottom: 48, left: 0, right: 0, textAlign: 'center', color: '#fff', fontWeight: 700, fontSize: 28, px: 2 }}>
          Serve yourself some<br />delicious cuisine
        </Typography>
      </Box>
    </Box>
  );
};

export default VerifyOtpForm; 