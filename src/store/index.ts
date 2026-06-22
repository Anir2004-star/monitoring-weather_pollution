import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import aqiReducer from './slices/aqiSlice';
import stationReducer from './slices/stationSlice';
import uiReducer from './slices/uiSlice';

// ─── Store ────────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: {
    aqi: aqiReducer,
    stations: stationReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ─── Typed Hooks ─────────────────────────────────────────────────────────────

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
