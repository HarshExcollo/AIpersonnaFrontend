import React from "react";
import { Box, Paper, Typography } from "@mui/material";

interface Stat {
  label: string;
  value: string;
}

interface ViewPersonaStatsProps {
  stats: Stat[];
}

const ViewPersonaStats: React.FC<ViewPersonaStatsProps> = ({ stats }) => (
  <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
    {stats.map((stat) => (
      <Paper
        key={stat.label}
        variant="outlined"
        sx={{
          flex: 1,
          borderRadius: 3,
          border: '1.5px solid #e0e0e0',
          boxShadow: 'none',
          p: 3,
          minWidth: 200,
          maxWidth: 250,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}
      >
        <Typography sx={{ color: '#222', fontWeight: 600, fontSize: 15, mb: 1 }}>{stat.label}</Typography>
        <Typography sx={{ color: '#222', fontWeight: 800, fontSize: 24 }}>{stat.value}</Typography>
      </Paper>
    ))}
  </Box>
);

export default ViewPersonaStats; 