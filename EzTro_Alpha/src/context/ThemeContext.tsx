import React, { useState, useEffect, createContext } from "react";
import { useColorScheme } from "react-native";

const darkimages = ["/images/dark.jpg"];
const lightimages = ["/images/light.jpg"];

const spacing = {
  xs: 4,
  sm: 8,
  base: 12,
  md: 16,
  lg: 24,
  xl: 32,
};
const Theme = {
  light: {
    color6: "#272626",
    color5: "#05f589",
    color4: "white",
    color3: "#A1A1A1",
    color2: "#272626",
    color: "#FF8F00",
    white: "white",
    black: "#000",
    backgroundColor: "#FFF",
    backgroundColor2: "#c9c9c9ff",
    backgroundColor3: "#ebebebff",
    rgbBackgroundColor: "255, 255, 255",
    backgroundImage: lightimages,
    transition: "all 1s ease-in-out",
    borderColor: "cyan",
    hoverBackgroundColor: "#F5F5F5",
  },
  dark: {
    color6: "#999a99",
    color5: "#dd05f5",
    color4: "#61dafb",
    color3: "#ECECEC",
    color2: "#EBEBEB",
    color: "#ff9100ff",
    white: "white",
    black: "#000",
    backgroundColor: "#101014ff",
    backgroundColor2: "#1a1a2e",
    backgroundColor3: "#232323e6",
    rgbBackgroundColor: "26, 26, 46",
    backgroundImage: darkimages,
    transition: "all 1s ease-in-out",
    borderColor: "red",
    hoverBackgroundColor: "#302e4d",
  },
};

const initialState = {
  dark: false,
  theme: Theme.light,
};

export const ThemeContext = createContext(initialState);

export function ThemeProvider({ children }: any) {
  const [dark, setDark] = useState(false);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (colorScheme === "dark") {
      setDark(true);
    } else {
      setDark(false);
    }
  }, [colorScheme]);

  const theme = dark ? Theme.dark : Theme.light;

  return (
    <ThemeContext.Provider value={{ theme: { ...theme, ...spacing }, dark }}>
      {children}
    </ThemeContext.Provider>
  );
}
