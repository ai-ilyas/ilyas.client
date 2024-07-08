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
        state.status = 'loading';
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.applications = action.payload;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(insertApplication.pending, (state, action) => {
        state.status = 'adding';
      })
      .addCase(insertApplication.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.applications.push(action.payload);
      })
      .addCase(insertApplication.rejected, (state, action) => {
        state.status = 'failed adding';
        state.error = action.error.message;
      })
            
      .addCase(updateApplication.pending, (state, action) => {
        state.status = 'updating';
      })
      .addCase(updateApplication.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const appIndex = state.applications.findIndex((x: IApplication) => x._id === action.payload._id)
        if (appIndex !== -1) {
          state.applications[appIndex] = {
            ...state.applications[appIndex],
            ...action.payload
          };
        }
      })
      .addCase(updateApplication.rejected, (state, action) => {
        state.status = 'failed updating';
        state.error = action.error.message;
      })

      .addCase(getApplication.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getApplication.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.applications = action.payload;
      })
      .addCase(getApplication.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  }
})

const apiRoot = "/en/api/application";

export const fetchApplications = createAsyncThunk('application/getAll', async () => {
   return (await fetch(apiRoot)).json();
});

export const getApplication = createAsyncThunk('application/getApplication', async (id: string) => {
  return (await fetch(`${apiRoot}/${id}`)).json();
});

export const insertApplication = createAsyncThunk('application/insertApplication', async (applicationName: string) => {
  return (await fetch(apiRoot + "/create", {
    method: 'POST',
    body: applicationName,
  })).json();
});

export const updateApplication = createAsyncThunk('application/updateApplication', async (application: Partial<IApplication>) => {
  return (await fetch(apiRoot + "/update", {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(application)
  })).json();
});

export const selectAllApplications = (state: RootState) => state.applications.applications;

export const selectApplicationStatus = (state: RootState) => state.applications.status;

export const selectApplicationById = (state: RootState, applicationId: any) =>
  state.applications.applications.find((x: IApplication) => x._id === applicationId)

export default applicationSlice.reducer
