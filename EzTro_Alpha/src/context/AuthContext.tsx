import React, { createContext, useContext, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setAccessToken, setUser } from "../features/auth/authSlice";
import { RootState } from "../stores/store";

interface AuthContextType {
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("accessToken");
        const storedUser = await AsyncStorage.getItem("user");
        if (storedToken) dispatch(setAccessToken(storedToken));
        if (storedUser) dispatch(setUser(JSON.parse(storedUser)));
      } catch (err) {}
    };
    loadAuth();
  }, [dispatch]);

  useEffect(() => {
    if (accessToken) AsyncStorage.setItem("accessToken", accessToken);
    else AsyncStorage.removeItem("accessToken");

    if (user) AsyncStorage.setItem("user", JSON.stringify(user));
    else AsyncStorage.removeItem("user");
  }, [accessToken, user]);

  const logoutHandler = async () => {
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/logout`, null, {
        withCredentials: true,
      });
    } catch (err) {
    } finally {
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("user");
    }
  };

  return <AuthContext.Provider value={{ logout: logoutHandler }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
