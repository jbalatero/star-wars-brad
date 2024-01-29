import { useQuery } from '@tanstack/react-query';
import { Character } from '@/types/types';

type QueryFnData = { count: number; next: string | null; previous: string | null; results: Array<Character> };

export const useQueryStarWarsPeople = (page: number) =>
  useQuery<QueryFnData>({
    queryKey: ['people', 'list', { page }],
    queryFn: () =>
      fetch(
        'https://swapi.dev/api/people?' +
          new URLSearchParams({
            page: page.toString(),
          }),
      ).then(response => response.json()),
  });
