import React from "react";
import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import BrushIcon from '@mui/icons-material/Brush';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const settingsSections = [
  {
    header: "Account",
    items: [
      {
        icon: <AccountCircleIcon fontSize="medium" sx={{ color: '#222' }} />, 
        title: "Account Details",
        subtitle: "Manage your account details",
      },
    ],
  },
  {
    header: "Notifications",
    items: [
      {
        icon: <NotificationsNoneIcon fontSize="medium" sx={{ color: '#222' }} />, 
        title: "Notification Preferences",
        subtitle: "Manage your notification preferences",
      },
    ],
  },
  {
    header: "Subscription",
    items: [
      {
        icon: <CreditCardIcon fontSize="medium" sx={{ color: '#222' }} />, 
        title: "Subscription",
        subtitle: "Manage your subscription",
      },
    ],
  },
  {
    header: "Customization",
    items: [
      {
        icon: <BrushIcon fontSize="medium" sx={{ color: '#222' }} />, 
        title: "Customize",
        subtitle: "Customize your experience",
      },
    ],
  },
];

const SettingsPage: React.FC = () => (
  <Box sx={{ p: 3, overflow: 'hidden' }}>
      {settingsSections.map((section, i) => (
        <Box key={section.header} sx={{ mb: i === settingsSections.length - 1 ? 0 : 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#111', mb: 1.2, fontSize: 22, letterSpacing: -1 }}>{section.header}</Typography>
          <List disablePadding>
            {section.items.map((item) => (
              <ListItem key={item.title} sx={{ px: 0, py: 1.2, borderRadius: 3, mb: 0.5, '&:hover': { background: '#f5f5f7' }, alignItems: 'center', minHeight: 64 }} secondaryAction={
                <IconButton edge="end" sx={{ color: '#222', background: 'none' }}>
                  <ChevronRightIcon />
                </IconButton>
              }>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#f4f4f7', width: 48, height: 48, mr: 2 }}>
                    {item.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography sx={{ fontWeight: 700, fontSize: 17, color: '#222', mb: 0.2 }}>{item.title}</Typography>}
                  secondary={<Typography sx={{ color: '#888', fontWeight: 400, fontSize: 14 }}>{item.subtitle}</Typography>}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
  </Box>
);

export default SettingsPage; 