import { describe, expect, vi } from 'vitest';
import Main from '../pages/main';
import { render, screen, userEvent } from './test-utils';
import { act } from '@testing-library/react-hooks';

const useQueryStarWarsPeople = vi.hoisted(() => vi.fn().mockReturnValue({}));
vi.mock('@/hooks/useQueryStarWarsPeople', () => ({ useQueryStarWarsPeople }));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

describe('Main page', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('the title is visible', () => {
    render(<Main />);
    expect(screen.getByText(/Star Wars Characters/i)).toBeInTheDocument();
  });

  it('should display loading indicator the first time', async () => {
    useQueryStarWarsPeople.mockReturnValue({
      data: {},
      isFetching: true,
      isLoadingError: false,
      error: null,
    });

    render(<Main />);

    expect(screen.getByTestId('is-fetching-loading-indicator')).toBeInTheDocument();
  });

  it('should display alert message when an error occurred', async () => {
    useQueryStarWarsPeople.mockReturnValue({
      data: undefined,
      isFetching: false,
      isLoadingError: true,
      error: new Error('Task failed successfully'),
    });

    render(<Main />);

    expect(screen.queryByTestId('cards-container')).toBeEmptyDOMElement();
    expect(screen.queryByTestId('is-fetching-loading-indicator')).toBeNull();
    expect(screen.getByRole('alert')).toContainHTML(
      'Error! Loading of Characters failed with error: Task failed successfully',
    );
    expect(screen.queryByTestId('prev-button')).toBeDisabled();
    expect(screen.queryByTestId('next-button')).toBeDisabled();
  });

  it('should display 1 card', async () => {
    useQueryStarWarsPeople.mockReturnValue({
      data: {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            name: 'Luke Skywalker',
            height: '172',
            mass: '77',
            hair_color: 'blond',
            skin_color: 'fair',
            eye_color: 'blue',
            birth_year: '19BBY',
            gender: 'male',
            homeworld: 'https://swapi.dev/api/planets/1/',
            films: [
              'https://swapi.dev/api/films/1/',
              'https://swapi.dev/api/films/2/',
              'https://swapi.dev/api/films/3/',
              'https://swapi.dev/api/films/6/',
            ],
            species: [],
            vehicles: ['https://swapi.dev/api/vehicles/14/', 'https://swapi.dev/api/vehicles/30/'],
            starships: ['https://swapi.dev/api/starships/12/', 'https://swapi.dev/api/starships/22/'],
            created: '2014-12-09T13:50:51.644000Z',
            edited: '2014-12-20T21:17:56.891000Z',
            url: 'https://swapi.dev/api/people/1/',
          },
        ],
      },
      isFetching: false,
      isLoadingError: false,
      error: null,
    });

    render(<Main />);

    const characterName = 'Luke Skywalker';
    const characterCard = screen.queryByTestId(characterName);

    expect(screen.queryByTestId('cards-container')!.childElementCount).toBe(1);
    expect(screen.queryByTestId('is-fetching-loading-indicator')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.queryByTestId('prev-button')).toBeDisabled();
    expect(screen.queryByTestId('next-button')).toBeDisabled();
    expect(
      characterCard!.querySelector(`img[src="https://picsum.photos/seed/${characterName}/350/200"]`),
    ).to.not.toBeNull();

    expect(screen.queryByRole('dialog')).toBeNull();

    !!characterCard && (await userEvent.click(characterCard));

    const characterDialog = await screen.findByTestId('dialog');
    expect(characterDialog).toBeInTheDocument();
    expect(characterDialog).toHaveTextContent(characterName);
  });
});
