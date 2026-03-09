import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { postNotificationApi } from "../../api/notification/notification";
import { INotification } from "./types";

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

// ─── Async thunks (call API + update state) ───────────────────────────

export const markReadAsync = createAsyncThunk(
  "notification/markRead",
  async (id: string) => {
    await postNotificationApi.markAsRead(id);
    return id;
  },
);

export const markAllReadAsync = createAsyncThunk(
  "notification/markAllRead",
  async () => {
    await postNotificationApi.markAsReadAll();
  },
);

// ─── Slice ────────────────────────────────────────────────────────────

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // Gọi khi fetch toàn bộ danh sách từ API
    setNotifications(state, action: PayloadAction<INotification[]>) {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(
        (n) => n.status === "unread",
      ).length;
    },

    // Gọi khi socket nhận được notification mới
    addNotification(state, action: PayloadAction<INotification>) {
      const exists = state.notifications.some(
        (n) => n._id === action.payload._id,
      );
      if (!exists) {
        state.notifications.unshift(action.payload);
        if (action.payload.status === "unread") state.unreadCount += 1;
      }
    },

    removeNotification(state, action: PayloadAction<string>) {
      const idx = state.notifications.findIndex(
        (n) => n._id === action.payload,
      );
      if (idx !== -1) {
        if (state.notifications[idx].status === "unread") {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(idx, 1);
      }
    },

    // Gọi khi user logout
    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(markReadAsync.fulfilled, (state, action) => {
        const notif = state.notifications.find((n) => n._id === action.payload);
        if (notif && notif.status === "unread") {
          notif.status = "read";
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllReadAsync.fulfilled, (state) => {
        state.notifications.forEach((n) => {
          n.status = "read";
        });
        state.unreadCount = 0;
      });
  },
});

export const {
  setNotifications,
  addNotification,
  clearNotifications,
  removeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
