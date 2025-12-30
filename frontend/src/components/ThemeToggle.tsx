"use client";

import React, { useEffect, useState } from "react";
import { Row, ToggleButton, useTheme } from "@once-ui-system/core";
import { useBackendConfig } from "./ConfigProvider";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { reapplyConfig } = useBackendConfig();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    setMounted(true);
    setCurrentTheme(document.documentElement.getAttribute("data-theme") || "light");
  }, []);

  useEffect(() => {
    setCurrentTheme(document.documentElement.getAttribute("data-theme") || "light");
  }, [theme]);

  const icon = currentTheme === "dark" ? "light" : "dark";
  const nextTheme = currentTheme === "light" ? "dark" : "light";

  const handleThemeToggle = () => {
    setTheme(nextTheme);
    // Reapply backend config after theme change to preserve brand colors
    setTimeout(() => {
      reapplyConfig();
    }, 100);
  };

  return (
    <ToggleButton
      prefixIcon={icon}
      onClick={handleThemeToggle}
      aria-label={`Switch to ${nextTheme} mode`}
    />
  );
};
