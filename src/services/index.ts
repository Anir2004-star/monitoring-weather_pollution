import apiClient from './api';
import type { ApiResponse, AQIReading, Station, Forecast, Hotspot, AnalyticsSummary } from '../types';

// ─── Station Services ─────────────────────────────────────────────────────────

export const stationService = {
  getAll: () =>
    apiClient.get<ApiResponse<Station[]>>('/stations'),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Station>>(`/stations/${id}`),
};

// ─── AQI Services ─────────────────────────────────────────────────────────────

export const aqiService = {
  getCurrent: (stationId: string) =>
    apiClient.get<ApiResponse<AQIReading>>(`/aqi/current/${stationId}`),

  getHistory: (stationId: string, from: string, to: string) =>
    apiClient.get<ApiResponse<AQIReading[]>>(`/aqi/history/${stationId}`, {
      params: { from, to },
    }),
};

// ─── Forecast Services ────────────────────────────────────────────────────────

export const forecastService = {
  get: (stationId: string) =>
    apiClient.get<ApiResponse<Forecast>>(`/forecast/${stationId}`),
};

// ─── Hotspot Services ─────────────────────────────────────────────────────────

export const hotspotService = {
  getAll: () =>
    apiClient.get<ApiResponse<Hotspot[]>>('/hotspots'),
};

// ─── Analytics Services ───────────────────────────────────────────────────────

export const analyticsService = {
  getSummary: (period: AnalyticsSummary['period'], stationId?: string) =>
    apiClient.get<ApiResponse<AnalyticsSummary>>('/analytics/summary', {
      params: { period, stationId },
    }),
};
