import { useQuery } from '@tanstack/react-query';
import { aqiService } from '../services';

const useAQI = (stationId: string) => {
  return useQuery({
    queryKey: ['aqi', 'current', stationId],
    queryFn: async () => {
      const { data } = await aqiService.getCurrent(stationId);
      return data.data;
    },
    enabled: Boolean(stationId),
    refetchInterval: 60_000, // refresh every 60s
    staleTime: 30_000,
  });
};

export default useAQI;
