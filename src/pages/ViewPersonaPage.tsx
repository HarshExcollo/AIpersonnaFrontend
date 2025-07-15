import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/discover/Header";
import ViewPersonaHeader from "../components/viewPersona/ViewPersonaHeader";
import ViewPersonaTabs from "../components/viewPersona/ViewPersonaTabs";
import ViewPersonaSection from "../components/viewPersona/ViewPersonaSection";
import ViewPersonaChips from "../components/viewPersona/ViewPersonaChips";
import type { Persona } from "../types";

interface ViewPersonaPageProps {
  persona?: Persona;
}

interface Trait {
  _id: string;
  title: string;
  category: string;
  description: string;
}

interface PersonaData {
  id: string;
  name: string;
  role: string;
  avatar: string;
  traits: Trait[];
}

const ViewPersonaPage: React.FC<ViewPersonaPageProps> = ({
  persona: propPersona,
}) => {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPersonaData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas/${id || "1"}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch persona data");
        }

        const data = await response.json();
        if (data.success && data.data) {
          setPersonaData(data.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching persona:", err);
        setError("Failed to load persona data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonaData();
  }, [id]);

  // Find trait by title
  const getTraitByTitle = (title: string) => {
    if (!personaData?.traits) return null;
    return personaData.traits.find(
      (trait) => trait.title && trait.title.toLowerCase() === title.toLowerCase()
    );
  };

  // Get about section content
  const getAboutContent = () => {
    const aboutTrait = getTraitByTitle("About");
    return aboutTrait?.description || "No about information available.";
  };

  // Get communication style content
  const getCommunicationStyleContent = () => {
    const communicationTrait = getTraitByTitle("Communication Style");
    return communicationTrait?.description || "No communication style information available.";
  };

  // Get core expertise content
  const getCoreExpertiseItems = () => {
    const expertiseTrait = getTraitByTitle("Core Expertise");
    if (!expertiseTrait?.description) return ["No core expertise information available."];
    return expertiseTrait.description.split('\n').map((item) => item.trim()).filter((item) => item.length > 0);
  };

  // Get traits content
  const getTraitsItems = () => {
    const traitsTrait = getTraitByTitle("Traits");
    if (!traitsTrait?.description) return ["No traits information available."];
    return traitsTrait.description.split('\n').map((item) => item.trim()).filter((item) => item.length > 0);
  };

  // Get pain points content
  const getPainPointsItems = () => {
    const painPointsTrait = getTraitByTitle("Pain Points");
    if (!painPointsTrait?.description) return ["No pain points information available."];
    return painPointsTrait.description.split('\n').map((item) => item.trim()).filter((item) => item.length > 0);
  };

  // Get key responsibilities content
  const getKeyResponsibilitiesItems = () => {
    const responsibilitiesTrait = getTraitByTitle("Key Responsibilities");
    if (!responsibilitiesTrait?.description) return ["No key responsibilities information available."];
    return responsibilitiesTrait.description.split('\n').map((item) => item.trim()).filter((item) => item.length > 0);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!personaData?.traits || personaData.traits.length === 0) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#fff", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Typography>No traits found for this persona.</Typography>
      </Box>
    );
  }

  // Use either the prop persona or the fetched persona data
  const persona = propPersona || personaData;

  // Get similar personas (all except the current one)
  // (You may want to fetch this from backend in the future)

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <Header />
      <Box
        sx={{
          display: "flex",
          pt: 4,
          pb: 6,
          maxWidth: 1350,
          margin: "0 auto",
        }}
      >
        {/* Remove ViewPersonaSidebar or update to use real data if needed */}
        {/* <ViewPersonaSidebar
          personas={similarPersonas}
          onSelect={(personaId) => {
            window.location.href = `/view-persona/${personaId}`;
          }}
          currentPersonaId={id}
        /> */}
        <Box
          sx={{
            flex: 1,
            pl: 2,
            maxWidth: "calc(100% - 100px)",
            overflowX: "hidden",
          }}
        >
          <ViewPersonaHeader
            avatar={persona?.avatar || ""}
            name={persona?.name || ""}
            role={persona?.role || ""}
            onStartChat={() => navigate(`/chat/${persona?.id}`)}
          />
          <ViewPersonaTabs value={tab} onChange={setTab} />
          {tab === 0 && (
            <>
              {/* Remove mockStats and use real stats if available */}
              {/* <ViewPersonaStats stats={mockStats} /> */}
              <ViewPersonaSection title="About">
                {getAboutContent()
                  .split("\n")
                  .map((p: string, i: number) => (
                    <Box key={i} sx={{ mb: 1, overflowWrap: "break-word" }}>
                      <span>{p}</span>
                    </Box>
                  ))}
              </ViewPersonaSection>
              <ViewPersonaSection title="Core Expertise">
                <ViewPersonaChips chips={getCoreExpertiseItems()} />
              </ViewPersonaSection>
              <ViewPersonaSection title="Communication Style">
                <Box sx={{ overflowWrap: "break-word" }}>
                  <span>{getCommunicationStyleContent()}</span>
                </Box>
              </ViewPersonaSection>
            </>
          )}
          {tab === 1 && (
            <>
              <ViewPersonaSection title="Traits">
                <ViewPersonaChips chips={getTraitsItems()} />
              </ViewPersonaSection>
              <ViewPersonaSection title="Pain Points">
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {getPainPointsItems().map((point) => (
                    <Box
                      key={point}
                      sx={{
                        border: "1.5px solid #e0e0e0",
                        borderRadius: 2,
                        p: 2.2,
                        minWidth: 250,
                        maxWidth: 280,
                        fontWeight: 500,
                        fontSize: 16,
                        color: "#222",
                        bgcolor: "#fff",
                        flex: "1 1 260px",
                        overflowWrap: "break-word",
                      }}
                    >
                      {point}
                    </Box>
                  ))}
                </Box>
              </ViewPersonaSection>
              <ViewPersonaSection title="Key Responsibilities">
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {getKeyResponsibilitiesItems().map((resp) => (
                    <Box
                      key={resp}
                      sx={{
                        border: "1.5px solid #e0e0e0",
                        borderRadius: 2,
                        p: 2.2,
                        minWidth: 250,
                        maxWidth: 280,
                        fontWeight: 500,
                        fontSize: 16,
                        color: "#222",
                        bgcolor: "#fff",
                        flex: "1 1 260px",
                        overflowWrap: "break-word",
                      }}
                    >
                      {resp}
                    </Box>
                  ))}
                </Box>
              </ViewPersonaSection>
            </>
          )}
          {/* Remove tabs 2 and 3 or update to use real data if needed */}
        </Box>
      </Box>
    </Box>
  );
};

export default ViewPersonaPage;
