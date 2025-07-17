import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show loader when location changes
    setIsLoading(true);
    
    // Hide loader after 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 2 seconds

    // Cleanup timer if component unmounts or location changes again
    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]); // Trigger when pathname changes

  // Function to manually hide loader (useful for faster page loads)
  const hideLoader = () => {
    setIsLoading(false);
  };

  // Function to manually show loader
  const showLoader = () => {
    setIsLoading(true);
  };

  return {
    isLoading,
    hideLoader,
    showLoader,
  };
}; 