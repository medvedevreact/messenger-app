import { configureStore } from "@reduxjs/toolkit";
import auth from "./slices/auth";
import theme from './slices/theme'

export const store = configureStore({
  reducer: {
    auth: auth,
    theme: theme
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
