"use client";

import React, { useEffect, useState } from "react";
import { Row, ToggleButton, useTheme } from "@once-ui-system/core";
import { useBackendConfig } from "./ConfigProvider";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { reapplyConfig } = useBackendConfig();
  const [mounted, setMounted] = useState(false);

  // Handle hydration - only render after client-side hydration
  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const icon = theme === "dark" ? "light" : "dark";
  const nextTheme = theme === "light" ? "dark" : "light";

  const handleThemeToggle = () => {
    setTheme(nextTheme);
    // Reapply backend config after theme change to preserve brand colors
    setTimeout(() => {
      reapplyConfig();
    }, 100);
  };

  // Only render after hydration to prevent mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ToggleButton
      prefixIcon={icon}
      onClick={handleThemeToggle}
      aria-label={`Switch to ${nextTheme} mode`}
    />
  );
};
