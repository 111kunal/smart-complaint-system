import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { API } from "../../config";
const API_URL = `${API}/api/complaints`;

// const API_URL = "http://localhost:5000/api/complaints";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchComplaints = createAsyncThunk(
  "complaints/fetchComplaints",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(API_URL, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch complaints");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createComplaint = createAsyncThunk(
  "complaints/createComplaint",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create complaint");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateComplaintStatus = createAsyncThunk(
  "complaints/updateComplaintStatus",
  async ({ id, newStatus }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${id}/status`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const assignComplaintToAgent = createAsyncThunk(
  "complaints/assignComplaintToAgent",
  async ({ id, agentId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/${id}/assign`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ agentId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to assign agent");
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  list: [],
  statusFilter: "All",
  search: "",
  showModal: false,
  selected: null,
  successMsg: "",
  loading: false,
  error: "",
};

const complaintsSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {
    clearSuccessMsg(state) {
      state.successMsg = "";
    },
    clearError(state) {
      state.error = "";
    },
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setSelected(state, action) {
      state.selected = action.payload;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      // create
      .addCase(createComplaint.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.showModal = false;
        state.successMsg = "Complaint filed successfully!";
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.error = action.payload || "Failed to create complaint";
      })
      // status update
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.selected?._id === action.payload._id) state.selected = action.payload;
      })
      .addCase(updateComplaintStatus.rejected, (state, action) => {
        state.error = action.payload || "Failed to update status";
      })
      // assign
      .addCase(assignComplaintToAgent.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c._id === action.payload._id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.selected?._id === action.payload._id) state.selected = action.payload;
      })
      .addCase(assignComplaintToAgent.rejected, (state, action) => {
        state.error = action.payload || "Failed to assign agent";
      });
  },
});

export const { clearSuccessMsg, clearError, setShowModal, setSelected, setStatusFilter, setSearch } =
  complaintsSlice.actions;
export default complaintsSlice.reducer;