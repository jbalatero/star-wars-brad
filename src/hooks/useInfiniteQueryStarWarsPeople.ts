import { DefaultError, InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';

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

export const useInfiniteQueryStarWarsPeople = () => {
  return useInfiniteQuery<QueryFnData, DefaultError, InfiniteData<QueryFnData>, QueryKey, number>({
    queryKey: ['people'],
    queryFn: ({ pageParam }) =>
      fetch(
        'https://swapi.dev/api/people?' +
          new URLSearchParams({
            page: pageParam.toString(),
          }),
      ).then(response => response.json()),
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (!lastPage.next) return null;
      const nextPage = new URL(lastPage.next).searchParams.get('page');
      return Number(nextPage);
    },
    getPreviousPageParam: firstPage => {
      if (!firstPage.previous) return null;
      const prevPage = new URL(firstPage.previous).searchParams.get('page');
      return Number(prevPage);
    },
  });
};
