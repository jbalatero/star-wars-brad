import { useQuery } from '@tanstack/react-query';

export type Character = {
  name: string;
  birth_year: string;
  eye_color: string;
  gender: string;
  hair_color: string;
  height: string;
  mass: string;
  skin_color: string;
  homeworld: string;
  films: Array<string>;
  species: Array<string>;
  starships: Array<string>;
  vehicles: Array<string>;
  url: string;
  created: string;
  edited: string;
};

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
