import { createSlice } from "@reduxjs/toolkit";

export const THEME_STORAGE_KEY = "theme";

type ThemeState = {
  mode: "light" | "dark";
};

const getInitialTheme = (): "light" | "dark" => {
  if (typeof localStorage === "undefined") return "light";
  return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
