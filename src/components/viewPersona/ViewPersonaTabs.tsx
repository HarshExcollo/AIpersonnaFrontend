import React from "react";
import { Box, Tabs, Tab } from "@mui/material";

interface ViewPersonaTabsProps {
  value: number;
  onChange: (value: number) => void;
}

const tabLabels = ["About", "Personality traits", "Use Cases", "Latest Updates"];

const ViewPersonaTabs: React.FC<ViewPersonaTabsProps> = ({ value, onChange }) => (
  <Box sx={{ borderBottom: 1, borderColor: '#e0e0e0', mb: 2 }}>
    <Tabs
      value={value}
      onChange={(_, v) => onChange(v)}
      textColor="inherit"
      TabIndicatorProps={{ style: { backgroundColor: '#219653', height: 3, borderRadius: 2 } }}
      sx={{
        '& .MuiTabs-indicator': {
          backgroundColor: 'green',
          height: 3,
          borderRadius: 2,
        },
        '& .MuiTab-root': {
          fontWeight: 700,
          fontSize: 16,
          color: '#888',
          textTransform: 'none',
          minWidth: 120,
        },
        '& .Mui-selected': {
          color: '#219653',
        },
      }}
    >
      {tabLabels.map((label, _) => (
        <Tab key={label} label={label} />
      ))}
    </Tabs>
  </Box>
);

export default ViewPersonaTabs; 