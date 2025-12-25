import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }: PropsWithChildren) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";

      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const changeTheme = () => setIsDark((prev) => !prev);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
