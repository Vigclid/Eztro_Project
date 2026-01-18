import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import todosReducer from "../features/todos/todosSlice";
import authReducer from "../features/auth/authSlice";

const rootReducer = combineReducers({
  todos: todosReducer,
  auth: authReducer,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["todos", "auth", "forum"],
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
