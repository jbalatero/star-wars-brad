import React, { useState } from 'react';
import { Character, useInfiniteQueryStarWarsPeople } from '@/hooks/useInfiniteQueryStarWarsPeople';
import { CharacterModal } from '@/pages/main/CharacterModal';

const Main = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | undefined>(undefined);

  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    isLoading,
    isLoadingError,
    error,
    ...result
  } = useInfiniteQueryStarWarsPeople();

  return (
    <div className="container mx-auto">
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {isLoading ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : isLoadingError ? (
          <div role="alert" className="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error! Loading of Homeworld failed with error: {error?.message}</span>
          </div>
        ) : null}

        {result.data?.pages?.map(page => {
          return page.results?.map(character => (
            <div
              key={character.name}
              className="card card-compact w-96 md:w-56 bg-base-100 hover:bg-base-300 shadow-xl mb-5 hover:cursor-pointer"
              onClick={() => setSelectedCharacter(character)}
            >
              <figure>
                <img src={`https://picsum.photos/seed/${character.name}/350/200`} alt="Character" />
              </figure>
              <div className="card-body">
                <h4 className="card-title">{character.name}</h4>
              </div>
            </div>
          ));
        })}
      </div>

      {selectedCharacter && (
        <CharacterModal character={selectedCharacter} onClose={() => setSelectedCharacter(undefined)} />
      )}
    </div>
  );
};

export default Main;
