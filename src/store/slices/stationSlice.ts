import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Station } from '../../types';

interface StationState {
  list: Station[];
  loading: boolean;
  error: string | null;
}

const initialState: StationState = {
  list: [],
  loading: false,
  error: null,
};

const stationSlice = createSlice({
  name: 'stations',
  initialState,
  reducers: {
    setStations(state, action: PayloadAction<Station[]>) {
      state.list = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const { setStations, setLoading, setError } = stationSlice.actions;
export default stationSlice.reducer;
