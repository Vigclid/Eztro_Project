import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosInstance } from "axios";
import { Misc } from "../../constants/misc";
import environments from "../../environments/env";
import { IUser } from "../../types/users";

export interface AuthState {
  accessToken: string | null;
  user: IUser | null;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  error: null,
};

const { NETWORK } = Misc();

const authAxios: AxiosInstance = axios.create({
  timeout: NETWORK.AUTH_TIMEOUT_MS,
  withCredentials: true,
});
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (
    { email, password, role }: { email: string; password: string; role: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await authAxios
        .post(
          `${environments.SERVER_URI}login`,
          {
            email,
            password,
            role,
          },
          {
            withCredentials: true,
          },
        )
        .then((res) => res.data);

      if (res.status !== "success") {
        return rejectWithValue(res.message);
      }

      const { accessToken, user } = res.data;

      await AsyncStorage.setItem("accessToken", accessToken);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      return { accessToken, user };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Sai email hoặc mật khẩu.",
      );
    }
  },
);

export const logoutAsync = createAsyncThunk("auth/logout", async () => {
  try {
    await authAxios.post(`${environments.SERVER_URI}logout`);
  } catch (err) {}
  await AsyncStorage.removeItem("accessToken");
  await AsyncStorage.removeItem("user");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    setUser(state, action: PayloadAction<IUser | null>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(loginAsync.pending, (state: any) => {
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state: any, action: any) => {
        state.accessToken = action.payload?.accessToken || null;
        state.user = action.payload?.user || null;
      })
      .addCase(loginAsync.rejected, (state: any, action: any) => {
        state.error = action.payload as string;
      })
      .addCase(logoutAsync.fulfilled, (state: any) => {
        state.accessToken = null;
        state.user = null;
      });
  },
});

export const { setAccessToken, setUser } = authSlice.actions;
export default authSlice.reducer;
