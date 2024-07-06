import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../index'
import { IApplication } from '@/src/lib/domain/entities/application.interface'

const initialState = {
  applications: [] as IApplication[],
  status: 'initial',
  error: null as any
}

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {}  ,
  extraReducers(builder) {
    builder
      .addCase(fetchApplications.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message;
      })
      .addCase(postNewApplication.pending, (state, action) => {
        state.status = 'adding'
      })
      .addCase(postNewApplication.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.applications.push(action.payload);
      })
      .addCase(postNewApplication.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message;
      })
  }
})

const apiRoot = "/en/api/application";

export const fetchApplications = createAsyncThunk('application/getAll', async () => {
   return (await fetch(apiRoot)).json();
});

export const postNewApplication = createAsyncThunk('application/newApplication', async (applicationName: string) => {
  return (await fetch(apiRoot + "/create", {
    method: 'POST',
    body: applicationName,
  })).json();
});

export const selectAllApplications = (state: RootState) => state.applications.applications;

export const selectApplicationStatus = (state: RootState) => state.applications.status;

export const selectApplicationById = (state: RootState, applicationId: any) =>
  state.applications.applications.find((x: IApplication) => x._id === applicationId)

export default applicationSlice.reducer
