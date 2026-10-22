import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../config";

export const fetchAgents = createAsyncThunk(
  "agents/fetchAgents",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/admin/agents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch agents");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleAgentStatus = createAsyncThunk(
  "agents/toggleAgentStatus",
  async (agentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/admin/agents/${agentId}/toggle-status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update agent status");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeAgent = createAsyncThunk(
  "agents/removeAgent",
  async (agentId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/admin/agents/${agentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to remove agent");
      return agentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  list: [],
  search: "",
  showModal: false,
  loading: false,
  error: "",
};

const agentSlice = createSlice({
  name: "agents",
  initialState,
  reducers: {
    setAgentSearch(state, action) {
      state.search = action.payload;
    },
    setAgentModal(state, action) {
      state.showModal = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAgents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(toggleAgentStatus.fulfilled, (state, action) => {
        const agent = state.list.find((a) => a._id === action.payload._id);
        if (agent) agent.status = action.payload.status;
      })
      .addCase(removeAgent.fulfilled, (state, action) => {
        state.list = state.list.filter((a) => a._id !== action.payload);
      });
  },
});

export const { setAgentSearch, setAgentModal} = agentSlice.actions;
export default agentSlice.reducer;