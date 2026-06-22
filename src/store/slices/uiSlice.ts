import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type Theme = 'dark' | 'light';
type SidebarState = 'expanded' | 'collapsed';

interface UIState {
  theme: Theme;
  sidebar: SidebarState;
  activeMapStyle: string;
  notifications: Notification[];
  timeOffset: number;
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: string;
}

const initialState: UIState = {
  theme: 'dark',
  sidebar: 'expanded',
  activeMapStyle: 'mapbox://styles/mapbox/dark-v11',
  notifications: [],
  timeOffset: 0,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
    },
    toggleSidebar(state) {
      state.sidebar = state.sidebar === 'expanded' ? 'collapsed' : 'expanded';
    },
    setMapStyle(state, action: PayloadAction<string>) {
      state.activeMapStyle = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    setTimeOffset(state, action: PayloadAction<number>) {
      state.timeOffset = action.payload;
    },
  },
});

export const { setTheme, toggleSidebar, setMapStyle, addNotification, removeNotification, setTimeOffset } =
  uiSlice.actions;
export default uiSlice.reducer;
