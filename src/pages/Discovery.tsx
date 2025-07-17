import React, { useEffect, useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/discover/Header";
import SearchBar from "../components/discover/SearchBar";
import FilterChips from "../components/discover/FilterChips";
import PersonaGrid from "../components/PersonaGrid";
import Pagination from "../components/Pagination";
import { mockFilters } from "../data/mockData";
import type { Persona, FilterOption } from "../types";

interface DiscoveryProps {
  onStartChat: (persona: Persona) => void;
}

const SEARCH_AREA_WIDTH = { xs: "100%", sm: 900, md: 1100, lg: 1200 };

// Define department order for consistent sorting
const DEPARTMENT_ORDER = ["Tech", "Marketing", "Sales"];

const Discovery: React.FC<DiscoveryProps> = ({ onStartChat }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize filters with all set to inactive (false) so "All" appears selected
  const [filters, setFilters] = useState<FilterOption[]>(
    mockFilters.map((filter) => ({
      ...filter,
      active: false, // Set all filters to inactive by default
    }))
  );

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/personas`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched personas:", data);
        if (data.success && Array.isArray(data.data)) {
          setPersonas(data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching personas:", error);
      });
  }, []);

  // Get currently selected departments
  const selectedDepartments = filters.filter(filter => filter.active);

  // Enhanced filter and sort logic
  const filteredAndSortedPersonas = personas
    .filter((persona) => {
      // Filter by search term
      const matchesSearch = searchTerm === "" || 
          persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        persona.department.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by department if any are selected
      const matchesDepartment = selectedDepartments.length === 0 || 
        selectedDepartments.some(filter => filter.value === persona.department);

      return matchesSearch && matchesDepartment;
    })
    .sort((a, b) => {
    // Sort by department order, then by name
      const aDeptIndex = DEPARTMENT_ORDER.indexOf(a.department);
      const bDeptIndex = DEPARTMENT_ORDER.indexOf(b.department);

      if (aDeptIndex !== bDeptIndex) {
        return aDeptIndex - bDeptIndex;
      }
      return a.name.localeCompare(b.name);
    });

  // Pagination logic
  const totalPersonas = filteredAndSortedPersonas.length;
  const totalPages = Math.ceil(totalPersonas / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPersonas = filteredAndSortedPersonas.slice(startIndex, startIndex + itemsPerPage);

  // Debug logging
  console.log("Personas state:", personas);
  console.log("Filtered personas:", filteredAndSortedPersonas);
  console.log("Paginated personas:", paginatedPersonas);
  console.log("Total personas:", totalPersonas);

  // Event handlers
  const handleFilterChange = (filterId: string) => {
    setFilters((prev) =>
      prev.map((filter) =>
        filter.value === filterId
          ? { ...filter, active: !filter.active }
          : filter
      )
    );
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle view persona navigation
  const handleViewPersona = (persona: Persona) => {
    navigate(`/view-persona/${persona.id}`);
  };



  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      <Header />
      <Container
        maxWidth={false}
        sx={{
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 1, sm: 3, md: 4 },
          maxWidth: { xs: "100%", sm: "900px", md: "1200px", lg: "1200px" },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Search Section */}
        <Box
          sx={{
            width: "100%",
            maxWidth: SEARCH_AREA_WIDTH,
            mb: { xs: 2, sm: 3 },
          }}
        >
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <SearchBar
              value={searchTerm}
              onChange={handleSearchChange}
              maxWidth="100%"
              fullWidth={true}
            />
          </Box>
        </Box>

        {/* Enhanced Filter Chips */}
        <Box
          sx={{
            width: "100%",
            maxWidth: SEARCH_AREA_WIDTH,
            mb: 3,
          }}
        >
          <FilterChips
            filters={filters}
            onFilterChange={handleFilterChange}
            showSelectedIndicator={true}
            showClearAll={true}
            title="Filter by Department"
          />
        </Box>

        {/* Results Summary with better messaging */}
        <Box
          sx={{
            width: "100%",
            maxWidth: SEARCH_AREA_WIDTH,
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        ></Box>

        {/* Personas Grid */}
        <Box
          sx={{
            width: "100%",
            maxWidth: SEARCH_AREA_WIDTH,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          {totalPersonas > 0 ? (
            <PersonaGrid
              personas={paginatedPersonas}
              onStartChat={onStartChat}
              onViewPersona={handleViewPersona}
            />
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                px: 2,
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#666",
                  mb: 1,
                }}
              >
                No personas found
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#999",
                }}
              >
                Try adjusting your search or filters
              </Typography>
            </Box>
          )}
        </Box>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: { xs: 3, sm: 4 },
              mb: { xs: 2, sm: 3 },
            }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Discovery;
