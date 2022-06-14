/* eslint-disable testing-library/no-debugging-utils, testing-library/no-node-access, testing-library/no-container */
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserAddPage } from ".";
import { fetchHelper } from '../../utils/fetch';

jest.mock('../../utils/fetch');

describe('UserAddPage', () => {
  it('renders without crashing', () => {
    render(<UserAddPage />);
  });

  it('submits form', async () => {
    (fetchHelper as any).mockResolvedValue({
      json: async () => ({ id: 1 }),
    });

    const name = 'test';
    const password = 'secretpassword';
    const role = 'user';
    

    render(<UserAddPage />);

    userEvent.type(screen.getByPlaceholderText('pracownik33'), name);
    userEvent.type(screen.getByPlaceholderText('Hasło do systemu'), password);

    fireEvent.click(screen.getByText('Stwórz'));

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await waitFor(() => expect(fetchHelper).toHaveBeenCalledTimes(1));
    expect(fetchHelper).toHaveBeenCalledWith('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        password,
        role
      })
    });
    await screen.findByText('Stwórz kolejnego użytkownika');

    fireEvent.click(screen.getByText('Stwórz kolejnego użytkownika'));
    expect(screen.getByPlaceholderText('pracownik33')).toBeInTheDocument();
  });

  it('submits form - sets error', async () => {
    (fetchHelper as any).mockResolvedValue({
      json: async () => ({ id: null }),
    });

    const name = 'test';
    const password = 'secretpassword';
    const role = 'user';
    

    render(<UserAddPage />);

    userEvent.type(screen.getByPlaceholderText('pracownik33'), name);
    userEvent.type(screen.getByPlaceholderText('Hasło do systemu'), password);

    fireEvent.click(screen.getByText('Stwórz'));

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await waitFor(() => expect(fetchHelper).toHaveBeenCalledTimes(1));
    expect(fetchHelper).toHaveBeenCalledWith('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        password,
        role
      })
    });
    await screen.findByText('Nie udało się dodać użytkownika');
  });
});
