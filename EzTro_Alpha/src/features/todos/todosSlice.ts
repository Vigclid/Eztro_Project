import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "./types";
import { ApiResponse } from "../../types/app.common";
import { apiService } from "../../service/apiService";

export type TodosState = {
  items: Todo[];
  loading: boolean;
  error: string | null;
};
const initialState: TodosState = {
  items: [],
  loading: false,
  error: null,
};
export const fetchTodosAsync = createAsyncThunk(
  "todos/fetchTodosAsync",
  async (_, { rejectWithValue }) => {
    try {
      const response = (await apiService
        .get(`v1/todos/me`)
        .then((res: any) => res.data)) as ApiResponse<Todo[]>;
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data);
    }
  },
);

export const addTodoAsync = createAsyncThunk(
  "todos/addTodoAsync",
  async (text: string, { rejectWithValue }) => {
    try {
      const response = (await apiService
        .post(`v1/todos/me`, { text, done: false })
        .then((res: any) => res.data)) as ApiResponse<Todo>;

      return response.data as Todo;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to add todo");
    }
  },
);

export const deleteTodoAsync = createAsyncThunk(
  "todos/deleteTodoAsync",
  async (_id: string, { rejectWithValue }) => {
    try {
      await apiService.delete(`v1/todos/${_id}`);
      return _id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to delete todo");
    }
  },
);

export const updateTodoAsync = createAsyncThunk(
  "todos/updateTodoAsync",
  async (todo: Partial<Todo> & { _id: string }, { rejectWithValue }) => {
    try {
      const response = (await apiService
        .put(`v1/todos/${todo._id}`, todo)
        .then((res: any) => res.data)) as ApiResponse<Todo>;

      return response.data as Todo;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to update todo");
    }
  },
);
export const toggleTodoAsync = createAsyncThunk(
  "todos/toggleTodoAsync",
  async (_id: string, { rejectWithValue }) => {
    try {
      const response = (await apiService
        .put(`v1/todos/toggle/${_id}`)
        .then((res: any) => res.data)) as ApiResponse<Todo>;

      return response.data as Todo;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to update todo");
    }
  },
);
const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodoLocal: {
      reducer(state, action: PayloadAction<Todo>) {
        state.items.unshift(action.payload);
      },
      prepare(text: string) {
        return {
          payload: {
            _id: null,
            text,
            done: false,
            createdAt: Date.now(),
            userId: "",
            optimistic: true,
          } as Todo & { optimistic?: boolean },
        };
      },
    },

    toggleTodoLocal(state, action: PayloadAction<string>) {
      const t = state.items.find((i) => i._id === action.payload);
      if (t) t.done = !t.done;
    },

    clearCompleted(state) {
      state.items = state.items.filter((i) => !i.done);
    },
  },

  extraReducers: (builder) => {
    builder
      // TOOGLE
      .addCase(toggleTodoAsync.fulfilled, (state, action) => {
        const updated = action.payload;
        const t = state.items.find((i) => i._id === updated._id);
        if (t) t.done = updated.done;
      })
      .addCase(toggleTodoAsync.rejected, (state, action) => {
        const failedId = (action.meta.arg as any)._id;
        const t = state.items.find((i) => i._id === failedId);
        if (t) t.done = !t.done;
        state.error = action.payload as string;
      })
      .addCase(fetchTodosAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodosAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload!;
      })
      .addCase(fetchTodosAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addTodoAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTodoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((t) => !(t as any).optimistic);
        state.items.unshift(action.payload);
      })
      .addCase(addTodoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.items = state.items.filter((t) => !(t as any).optimistic);
      })

      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
      })
      .addCase(deleteTodoAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateTodoAsync.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (i) => i._id === action.payload._id,
        );
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateTodoAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { addTodoLocal, toggleTodoLocal, clearCompleted } =
  todosSlice.actions;

export default todosSlice.reducer;
