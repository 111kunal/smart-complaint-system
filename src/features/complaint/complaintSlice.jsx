import { createSlice } from "@reduxjs/toolkit";
import { INITIAL_COMPLAINTS } from "../../data/constants";


const initialState = {
  list: INITIAL_COMPLAINTS,   // all complaints
  statusFilter: "All",        // which tab is active
  search: "",                 // search box value
  showModal: false,           // is the "New Complaint" modal open?
  selected: null,             // which complaint is open in the detail panel?
  successMsg: "",             // green success banner text
};


const complaintsSlice = createSlice({
  name: "complaints",   

  initialState,

  reducers: {
    
    addComplaint(state, action) {
      const newId = `CMP-${String(state.list.length + 1).padStart(3, "0")}`;
      const newComplaint = {
        ...action.payload,
        id: newId,
        status: "Open",
        date: new Date().toISOString().split("T")[0],
        agent: "Unassigned",
      };
      
      state.list.unshift(newComplaint);    
      state.showModal = false;
      state.successMsg = `Complaint ${newId} filed successfully!`;
    },

    
    clearSuccessMsg(state) {
      state.successMsg = "";
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
    updateStatus(state,action){
      const {id,newStatus} = action.payload;
      const complaint = state.list.find((c) => c.id === id);
      if(complaint) complaint.status = newStatus;
      if(state.selected?.id === id) state.selected.status = newStatus;
    },
    assignAgent(state,action){
      const { id, newAgent } = action.payload;
      const assignedDate = new Date().toISOString().split("T")[0];
      const complaint = state.list.find((c) => c.id === id);
      if (complaint) {
        complaint.agent = newAgent;
        complaint.assignedDate = assignedDate;
        complaint.status = "In Progress"
      }
      if (state.selected?.id === id) {
        state.selected.agent = newAgent;
        state.selected.assignedDate = assignedDate;
        state.selected.status = "In Progress"
      }
    },
  },
});

export const {
  addComplaint,
  clearSuccessMsg,
  setShowModal,
  setSelected,
  setStatusFilter,
  setSearch,
  updateStatus,
  assignAgent,
} = complaintsSlice.actions;

export default complaintsSlice.reducer;