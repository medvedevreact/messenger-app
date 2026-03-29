import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import styles from "./ThemeToggle.module.scss";
import { toggleTheme as toggleThemeAction, THEME_STORAGE_KEY } from "../../store/slices/theme";
import type { RootState } from "../../store/store";

export const ThemeToggle: React.FC = () => {
  const theme = useSelector((state: RootState) => state.theme.mode);
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <button
      type="button"
      className={styles.root}
      onClick={() => dispatch(toggleThemeAction())}
      title={theme === "light" ? "Тёмная тема" : "Светлая тема"}
      aria-label={
        theme === "light" ? "Включить тёмную тему" : "Включить светлую тему"
      }
    >
      {theme === "light" ? (
        <HiOutlineMoon size={22} />
      ) : (
        <HiOutlineSun size={22} />
      )}
      <span>{theme === "light" ? "Тёмная тема" : "Светлая тема"}</span>
    </button>
  );
};
