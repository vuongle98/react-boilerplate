import { useSettings } from "@/app/providers/SettingsProvider";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useCallback, useEffect, useState } from "react";

export const useFilterVisibility = () => {
  const isMobile = useIsMobile();
  const { settings } = useSettings();
  const [showFilters, setShowFilters] = useState(
    settings.display?.defaultExpandFilter ?? true // Default to true if undefined
  );
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    setShowFilters(settings.display?.defaultExpandFilter ?? true);
  }, [settings.display?.defaultExpandFilter]);

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const toggleFilters = useCallback(() => {
    const newValue = !showFilters;
    setShowFilters(newValue);
    // Persist via SettingsContext so all pages stay in sync
  }, [showFilters]);

  return {
    isMobile,
    showFilters,
    isOpen,
    setIsOpen,
    toggleFilters,
  };
};
