import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { API_BASE as API } from "../../config/api";

type AuthState = {
  user: unknown;
  isAuthenticated: boolean;
  error: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
};

type AuthSuccessPayload = { user: unknown };

export const registerUser = createAsyncThunk<
  AuthSuccessPayload,
  { email: string; password: string },
  { rejectValue: string }
>(
  "auth/register",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API}/sign-up`,
        credentials,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Ошибка регистрации"
      );
    }
  }
);

export const logoutUser = createAsyncThunk<
  { message: string },
  void,
  { rejectValue: string }
>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API}/log-out`, null, {
        withCredentials: true,
      });
      return { message: "Logged out successfully" };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Ошибка выхода");
    }
  }
);

export const checkAuth = createAsyncThunk<
  AuthSuccessPayload,
  void,
  { rejectValue: string }
>(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/me`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue("Не авторизован");
    }
  }
);

export const loginUser = createAsyncThunk<
  AuthSuccessPayload,
  { email: string; password: string },
  { rejectValue: string }
>(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API}/sign-in`,
        credentials,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Ошибка авторизации"
      );
    }
  }
);

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => { 
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload ?? "Ошибка регистрации";
      });

    builder
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.error = null; 
      });

    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = null; 
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload ?? "Ошибка выхода";
      });

    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload ?? "Ошибка авторизации";
      });
  },
});

export const { clearError } = auth.actions; 
export default auth.reducer;