import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
const ThemeContext = createContext(undefined);
export const ThemeProvider = ({ children, }) => {
    const [isDark, setIsDark] = useState(() => {
        // Check localStorage or system preference
        const saved = localStorage.getItem("theme");
        if (saved)
            return saved === "dark";
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });
    useEffect(() => {
        localStorage.setItem("theme", isDark ? "dark" : "light");
        document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    }, [isDark]);
    const toggleTheme = () => setIsDark(!isDark);
    return (_jsx(ThemeContext.Provider, { value: { isDark, toggleTheme }, children: children }));
};
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
};
