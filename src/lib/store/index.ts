import { configureStore } from '@reduxjs/toolkit';
import applicationReducer from './features/application/application-slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      applications: applicationReducer
    }
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
