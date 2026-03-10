import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getNotificationApi,
  PaginatedNotificationResult,
  postNotificationApi,
} from "../../api/notification/notification";
import { INotification } from "./types";

interface NotificationState {
  notifications: INotification[];
  unreadCount: number;
  nextCursor: string | null;
  hasMore: boolean;
  isFetchingMore: boolean;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  nextCursor: null,
  hasMore: true,
  isFetchingMore: false,
};

// ─── Async thunks ─────────────────────────────────────────────────────

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

export const fetchMoreNotificationsAsync = createAsyncThunk(
  "notification/fetchMore",
  async (cursor: string) => {
    return await getNotificationApi.getMyNotification(cursor);
  },
);

// ─── Slice ────────────────────────────────────────────────────────────

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    // Called on initial load (socket connect / refresh)
    setNotifications(state, action: PayloadAction<PaginatedNotificationResult>) {
      state.notifications = action.payload.data;
      state.nextCursor = action.payload.nextCursor;
      state.hasMore = action.payload.hasMore;
      state.unreadCount = action.payload.data.filter(
        (n) => n.status === "unread",
      ).length;
    },

    // Called when socket receives a new notification
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

    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
      state.nextCursor = null;
      state.hasMore = true;
      state.isFetchingMore = false;
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
      })
      .addCase(fetchMoreNotificationsAsync.pending, (state) => {
        state.isFetchingMore = true;
      })
      .addCase(fetchMoreNotificationsAsync.fulfilled, (state, action) => {
        const incoming = action.payload.data;
        const existingIds = new Set(state.notifications.map((n) => n._id));
        const newItems = incoming.filter((n) => !existingIds.has(n._id));
        state.notifications.push(...newItems);
        state.nextCursor = action.payload.nextCursor;
        state.hasMore = action.payload.hasMore;
        state.isFetchingMore = false;
        state.unreadCount = state.notifications.filter(
          (n) => n.status === "unread",
        ).length;
      })
      .addCase(fetchMoreNotificationsAsync.rejected, (state) => {
        state.isFetchingMore = false;
      })
      .addCase("auth/logout/fulfilled", (state) => {
        state.notifications = [];
        state.unreadCount = 0;
        state.nextCursor = null;
        state.hasMore = true;
        state.isFetchingMore = false;
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
