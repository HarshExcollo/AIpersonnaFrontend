import React, { useState } from "react";
import { Box } from "@mui/material";
import Header from "../components/discover/Header";
import PersonaSelectorHeader from "../components/personaSelector/PersonaSelectorHeader";
import SearchBar from "../components/discover/SearchBar";
import PersonaSelectorGrid from "../components/personaSelector/PersonaSelectorGrid";
import ChatInputBar from "../components/ChatInputBar";
import type { Persona } from "../types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PersonaSelectorPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [personas, setPersonas] = useState<Persona[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setPersonas(data.data);
        }
      });
  }, []);

  const filteredPersonas = personas
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.role.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 6); // Only show first six personas

  const handleSelect = (persona: Persona) => {
    navigate(`/chat/${persona.id}`);
  };

  const handleViewPersona = (persona: Persona) => {
    navigate(`/view-persona/${persona.id}`);
  };

  const handleSendMessage = (msgObj: { message: string; fileUrl?: string; fileType?: string }) => {
    // For now, just log the message. Later you can implement logic to:
    // 1. Select a default persona or ask user to select one
    // 2. Navigate to chat with the message pre-filled
    console.log("Message to send:", msgObj.message);
    if (msgObj.fileUrl) {
      console.log("File attached:", msgObj.fileUrl, msgObj.fileType);
    }

    // Example: Navigate to first persona with message
    if (filteredPersonas.length > 0) {
      navigate(`/chat/${filteredPersonas[0].id}`, {
        state: { initialMessage: msgObj.message },
      });
    }
  };

  const defaultSuggestions = [
    "Help me with marketing strategy",
    "Analyze sales performance",
    "Review technical architecture",
    "Get business insights",
    "Plan product roadmap",
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#fff",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Header />
      <PersonaSelectorHeader />

      {/* Main content area */}
      <Box sx={{ flex: 1, pb: 20 }}>
        <Box sx={{ width: "100%", maxWidth: 1300, mx: "auto", mb: 3 }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search"
            maxWidth={840}
            fullWidth
          />
        </Box>

        <PersonaSelectorGrid
          personas={filteredPersonas}
          onSelect={handleSelect}
          onViewPersona={handleViewPersona}
        />
      </Box>

      {/* Reusable Chat Input Bar */}
      <ChatInputBar
        value={message}
        onChange={setMessage}
        onSend={handleSendMessage}
        placeholder="Ask any question or describe what you need help with..."
        showSuggestions={true}
        suggestions={defaultSuggestions}
        maxWidth={1200}
      />
    </Box>
  );
};

export default PersonaSelectorPage;
