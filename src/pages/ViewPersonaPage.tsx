import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/discover/Header";
import ViewPersonaHeader from "../components/viewPersona/ViewPersonaHeader";
import ViewPersonaTabs from "../components/viewPersona/ViewPersonaTabs";
import ViewPersonaSection from "../components/viewPersona/ViewPersonaSection";
import ViewPersonaChips from "../components/viewPersona/ViewPersonaChips";
import ViewPersonaSidebar from "../components/viewPersona/ViewPersonaSidebar";
import type { Persona } from "../types";
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';

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

interface SimilarPersona {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const ViewPersonaPage: React.FC<ViewPersonaPageProps> = ({
  persona: propPersona,
}) => {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [personaData, setPersonaData] = useState<PersonaData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [allPersonas, setAllPersonas] = useState<SimilarPersona[]>([]);
  const navigate = useNavigate();

  // Fetch all personas for similar personas list
  useEffect(() => {
    const fetchAllPersonas = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.data)) {
            setAllPersonas(data.data);
          }
        }
      } catch (err) {
        console.error("Error fetching all personas:", err);
      }
    };

    fetchAllPersonas();
  }, []);

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

  // Get similar personas (all except the current one)
  const getSimilarPersonas = (): SimilarPersona[] => {
    if (!allPersonas.length) return [];
    return allPersonas.filter(persona => persona.id !== id);
  };

  // Handle similar persona selection
  const handleSimilarPersonaSelect = (personaId: string) => {
    navigate(`/view-persona/${personaId}`);
  };

  // Add mock data for Use Cases tab
  const mockSampleQuestions = [
    {
      img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      text: "How should I explain our fallback transaction mechanism in pitches?",
    },
    {
      img: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      text: "What's the best way to position our QR settlement timelines?",
    },
    {
      img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
      text: "Can you help validate how we compare to Razorpay on uptime and disputes?",
    },
    {
      img: "",
      text: "How do I counter merchant objections about T+1 settlements?",
    },
  ];
  const mockExampleInteractions = [
    {
      name: "Sarah Chen",
      avatar: "https://randomuser.me/api/portraits/women/47.jpg",
      text: "A client asked if we offer instant settlement. How flexible are we on that?",
    },
    {
      name: "Sarah Chen",
      avatar: "https://randomuser.me/api/portraits/women/47.jpg",
      text: "What's our standard SLA for resolving failed transactions during peak hours?",
    },
  ];

  // Add mock data for Latest Updates tab
  const mockUpdates = [
    {
      icon: <InsertDriveFileOutlinedIcon sx={{ fontSize: 28, color: "#222" }} />,
      title: "Integrated April 2025 Meta Ads update",
      date: "April 20, 2025",
    },
    {
      icon: <ComputerOutlinedIcon sx={{ fontSize: 28, color: "#222" }} />,
      title: "Completed training on new product features",
      date: "April 15, 2025",
    },
    {
      icon: <StorageOutlinedIcon sx={{ fontSize: 28, color: "#222" }} />,
      title: "Updated knowledge base with Q1 2025 data",
      date: "April 10, 2025",
    },
    {
      icon: <EditOutlinedIcon sx={{ fontSize: 28, color: "#222" }} />,
      title: "Refreshed persona's tone and style guidelines",
      date: "April 5, 2025",
    },
    {
      icon: <PublicOutlinedIcon sx={{ fontSize: 28, color: "#222" }} />,
      title: "Added support for new languages",
      date: "March 28, 2025",
    },
  ];

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
          pr: 8,
          maxWidth: 1350,
          margin: "0 auto",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Similar Personas Sidebar - Hidden on mobile */}
        <Box sx={{ display: { xs: "none", md: "block" }, pl: 3 }}>
          <ViewPersonaSidebar
            personas={getSimilarPersonas()}
            onSelect={handleSimilarPersonaSelect}
            currentPersonaId={id}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            pl: { xs: 2, md: 2 },
            maxWidth: { xs: "100%", md: "calc(100% - 240px)" },
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
              {/* Stats Boxes */}
              <Box sx={{ display: "flex", gap: 2, mb: 4, flexWrap: "wrap" }}>
                <Box
                  sx={{
                    border: "1.5px solid #e0e0e0",
                    borderRadius: 2,
                    p: 3,
                    minWidth: 200,
                    flex: "1 1 200px",
                    bgcolor: "#fff",
                  }}
                >
                  <Typography sx={{ color: "#666", fontSize: 14, fontWeight: 500, mb: 1 }}>
                    Avg. User Rating
                  </Typography>
                  <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#222" }}>
                    4.8/5
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: "1.5px solid #e0e0e0",
                    borderRadius: 2,
                    p: 3,
                    minWidth: 200,
                    flex: "1 1 200px",
                    bgcolor: "#fff",
                  }}
                >
                  <Typography sx={{ color: "#666", fontSize: 14, fontWeight: 500, mb: 1 }}>
                    Total Conversations
                  </Typography>
                  <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#222" }}>
                    23.4K
                  </Typography>
                </Box>
                <Box
                  sx={{
                    border: "1.5px solid #e0e0e0",
                    borderRadius: 2,
                    p: 3,
                    minWidth: 200,
                    flex: "1 1 200px",
                    bgcolor: "#fff",
                  }}
                >
                  <Typography sx={{ color: "#666", fontSize: 14, fontWeight: 500, mb: 1 }}>
                    Success Rate
                  </Typography>
                  <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#222" }}>
                    92%
                  </Typography>
                </Box>
              </Box>
              <ViewPersonaSection title="About">
                {getAboutContent()
                  .split("\n")
                  .map((p: string, i: number) => (
                    <Box key={i} sx={{ mb: 1, overflowWrap: "break-word", textAlign: "justify" }}>
                      <span>{p}</span>
                    </Box>
                  ))}
              </ViewPersonaSection>
              <ViewPersonaSection title="Core Expertise">
                <ViewPersonaChips chips={getCoreExpertiseItems()} />
              </ViewPersonaSection>
              <ViewPersonaSection title="Communication Style">
                <Box sx={{ overflowWrap: "break-word", textAlign: "justify" }}>
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
          {tab === 2 && (
            <>
              <ViewPersonaSection title="Sample Questions" sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, overflowX: 'auto', justifyContent: 'flex-start', pb: 1 }}>
                  {mockSampleQuestions.map((q, idx) => (
                    <Box key={idx} sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      bgcolor: '#fff',
                      borderRadius: 3,
                      p: 0,
                      minWidth: 200,
                      maxWidth: 200,
                      width: 150,
                      boxShadow: '0 1px 4px rgba(44,62,80,0.04)',
                    }}>
                      <Box
                        sx={{
                          width: 200,
                          height: 200,
                          bgcolor: q.img ? 'transparent' : '#e8f2ed',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mt: 2,
                          mb: 2,
                          overflow: 'hidden',
                        }}
                      >
                        {q.img ? (
                          <Box component="img" src={q.img} alt="question" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: '#cfe7db' }} />
                        )}
                      </Box>
                      <Typography sx={{ fontSize: 14, color: '#111', fontWeight: 500, textAlign: 'center', px: 1, pb: 2 }}>{q.text}</Typography>
                    </Box>
                  ))}
                </Box>
              </ViewPersonaSection>
              <ViewPersonaSection title="Example Interactions">
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {mockExampleInteractions.map((ex, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Box component="img" src={ex.avatar} alt={ex.name} sx={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', mt: 0.5 }} />
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: 15, color: '#059134', mb: 0.5 }}>{ex.name}</Typography>
                        <Box sx={{ bgcolor: '#e8f5e9', borderRadius: 2, px: 2, py: 1, display: 'inline-block', fontSize: 16, color: '#222', fontWeight: 500 }}>
                          {ex.text}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </ViewPersonaSection>
            </>
          )}
          {tab === 3 && (
            <ViewPersonaSection title="Latest Updates">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {mockUpdates.map((update, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#f8fafb', borderRadius: 2, p: 2, boxShadow: '0 1px 4px rgba(44,62,80,0.04)' }}>
                    <Box>{update.icon}</Box>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ fontWeight: 600, fontSize: 16, color: '#222' }}>{update.title}</Box>
                      <Box sx={{ fontSize: 14, color: '#888', mt: 0.5 }}>{update.date}</Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </ViewPersonaSection>
          )}
          {/* Remove tabs 2 and 3 or update to use real data if needed */}
        </Box>
      </Box>
    </Box>
  );
};

export default ViewPersonaPage;
