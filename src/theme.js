import { createContext, useContext } from "react";

export const THEMES = {
  dark: {
    mode: "dark",
    bg: "#0B0F14",
    panel: "#121821",
    panelAlt: "#0F141B",
    panelBorder: "#1F2833",
    text: "#E9E7E1",
    muted: "#8B93A1",
    gold: "#D4A857",
    goldSoft: "#3A311F",
    teal: "#4FD1C5",
    tealSoft: "#152A28",
    warn: "#E2725B",
    warnSoft: "#3A2119",
    violet: "#9D8EC7",
    violetSoft: "#241F33",
  },
  light: {
    mode: "light",
    bg: "#F7F5F0",
    panel: "#FFFFFF",
    panelAlt: "#FBFAF7",
    panelBorder: "#E4E0D6",
    text: "#20242B",
    muted: "#6B7280",
    gold: "#A9752F",
    goldSoft: "#F3E7D2",
    teal: "#12857A",
    tealSoft: "#DFF3F0",
    warn: "#B14A34",
    warnSoft: "#F6E2DC",
    violet: "#6E5FA6",
    violetSoft: "#EBE7F5",
  },
};

export const ThemeContext = createContext(THEMES.dark);

export function useTheme() {
  return useContext(ThemeContext);
}
