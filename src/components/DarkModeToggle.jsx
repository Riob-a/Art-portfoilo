import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../components/ThemeContext";

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="dark-mode-toggle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="toggle-track">
        <span className="toggle-sun"><FaSun size={10} /></span>
        <span className="toggle-moon"><FaMoon size={10} /></span>
        <span className={`toggle-thumb ${isDark ? "thumb-dark" : "thumb-light"}`} />
      </span>

      <span className="toggle-label">{isDark ? "LITE" : "DARK"}</span>
    </button>
  );
}