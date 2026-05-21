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
      {/* Icon track */}
      <span className="toggle-track">
        <span className="toggle-sun">☀</span>
        <span className="toggle-moon">☽</span>
        <span className={`toggle-thumb ${isDark ? "thumb-dark" : "thumb-light"}`} />
      </span>

      {/* Label */}
      <span className="toggle-label">{isDark ? "LITE" : "DARK"}</span>
    </button>
  );
}
