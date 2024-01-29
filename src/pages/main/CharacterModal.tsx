import React, { DialogHTMLAttributes, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { Character, Homeworld } from '@/types/types';

export const CharacterModal: React.VFC<{
  character: Character;
  onClose: DialogHTMLAttributes<HTMLDialogElement>['onClose'];
}> = ({ character, onClose }) => {
  const homeworldResult = useQuery<Homeworld>({
    enabled: (character.homeworld || '').length > 0,
    queryKey: ['homeworld', character.homeworld],
    queryFn: () => fetch(character.homeworld).then(response => response.json()),
  });

  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (character) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [character]);

  return (
    <dialog ref={ref} data-testid="dialog" className="modal" onClose={onClose}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">{character?.name}</h3>
        <table className="table">
          <tbody>
            <tr>
              <th>Height(m)</th>
              <td>{character?.height && Number(character?.height) / 100}</td>
            </tr>
            <tr>
              <th>Mass(kg)</th>
              <td>{character?.mass}</td>
            </tr>
            <tr>
              <th>Birth Year</th>
              <td>{character?.birth_year}</td>
            </tr>
            <tr>
              <th>Added</th>
              <td>{character?.created && format(character?.created, 'dd-MM-yyyy')}</td>
            </tr>
            <tr>
              <th>Number of films</th>
              <td>{character?.films?.length ?? 0}</td>
            </tr>
          </tbody>
        </table>

        {homeworldResult.isLoading ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : homeworldResult.isLoadingError ? (
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
            <span>Error! Loading of Homeworld failed with error: {homeworldResult.error?.message}</span>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-lg my-4">Homeworld</h3>
            <table className="table">
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{homeworldResult?.data?.name}</td>
                </tr>
                <tr>
                  <th>Terrain</th>
                  <td>{homeworldResult?.data?.terrain}</td>
                </tr>
                <tr>
                  <th>Climate</th>
                  <td>{homeworldResult?.data?.climate}</td>
                </tr>
                <tr>
                  <th>Number of residents</th>
                  <td>{homeworldResult?.data?.residents?.length}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
