import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_AGENTS } from "../../data/constants";

const initialState = {
  list: INITIAL_AGENTS, // all agents
  search: "",           // search box value (agents view)
  showModal: false,     // is the "Add Agent" modal open?
};

const agentSlice = createSlice({
  name: "agents", // ← was "complaints" (copy-paste leftover). Fixed.

  initialState,

  reducers: {
    addAgent(state, action) {
      const newId = `AGT-${String(state.list.length + 1).padStart(3, "0")}`;
      state.list.push({
        ...action.payload, // { name, email, password }
        id: newId,
        status: "Active",
      });
      state.showModal = false;
    },

    toggleAgentStatus(state, action) {
      const agent = state.list.find((a) => a.id === action.payload);
      if (agent) {
        agent.status = agent.status === "Active" ? "Inactive" : "Active";
      }
    },

    removeAgent(state, action) {
      state.list = state.list.filter((a) => a.id !== action.payload);
    },

    setAgentSearch(state, action) {
      state.search = action.payload;
    },

    setAgentModal(state, action) {
      state.showModal = action.payload;
    },
  },
});

export const {
  addAgent,
  toggleAgentStatus,
  removeAgent,
  setAgentSearch,
  setAgentModal,
} = agentSlice.actions;

export default agentSlice.reducer;