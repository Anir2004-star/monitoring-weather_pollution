import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AQIReading } from '../../types';

interface AQIState {
  currentReadings: Record<string, AQIReading>;
  selectedStationId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AQIState = {
  currentReadings: {},
  selectedStationId: null,
  loading: false,
  error: null,
};

const aqiSlice = createSlice({
  name: 'aqi',
  initialState,
  reducers: {
    setReading(state, action: PayloadAction<AQIReading>) {
      state.currentReadings[action.payload.stationId] = action.payload;
    },
    setSelectedStation(state, action: PayloadAction<string | null>) {
      state.selectedStationId = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setReading, setSelectedStation, setLoading, setError } = aqiSlice.actions;
export default aqiSlice.reducer;
