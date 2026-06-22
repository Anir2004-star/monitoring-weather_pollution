import { useQuery } from '@tanstack/react-query';
import { stationService } from '../services';

const useStations = () => {
  return useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      const { data } = await stationService.getAll();
      return data.data;
    },
    staleTime: 5 * 60_000, // 5 minutes
  });
};

export default useStations;
