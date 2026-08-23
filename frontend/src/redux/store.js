import { configureStore } from '@reduxjs/toolkit'
import complaintReducer from '../features/complaint/complaintSlice'
import agentReducer from '../features/complaint/agentSlice'

export const store = configureStore({
  reducer: {
    complaints:complaintReducer,
    agents: agentReducer,
  },
});
export default store;