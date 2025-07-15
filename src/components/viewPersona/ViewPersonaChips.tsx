import React from "react";
import { Box, Chip } from "@mui/material";

interface ViewPersonaChipsProps {
  chips: string[];
}

const ViewPersonaChips: React.FC<ViewPersonaChipsProps> = ({ chips }) => (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 1, maxWidth: '100%' }}>
    {chips.map((chip) => (
      <Chip
        key={chip}
        label={chip}
        sx={{
          bgcolor: '#e8f5e8',
          color: '#219653',
          fontWeight: 600,
          fontSize: 15,
          borderRadius: 2,
          px: 1.5,
          height: 34,
          maxWidth: '100%',
          '& .MuiChip-label': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }
        }}
      />
    ))}
  </Box>
);

export default ViewPersonaChips; 