import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "../features/auth/authSlice";
import notificationReducer from "../features/notification/notificationSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  notification: notificationReducer, // không persist — fetch fresh từ API mỗi lần mở app
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "forum"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
