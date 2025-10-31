import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useCallback, useEffect, useState } from "react";

export const useFilterVisibility = () => {
  const isMobile = useIsMobile();

  // Start with default values - filters are expanded by default
  const [showFilters, setShowFilters] = useState(true);
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  return {
    isMobile,
    showFilters,
    isOpen,
    setIsOpen,
    toggleFilters,
  };
};
