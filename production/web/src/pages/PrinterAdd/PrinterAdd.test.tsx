/* eslint-disable testing-library/no-debugging-utils, testing-library/no-node-access, testing-library/no-container */
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrinterAddPage } from ".";
import { fetchHelper } from '../../utils/fetch';

jest.mock('../../utils/fetch');

describe('PrinterAddPage', () => {
  it('renders without crashing', () => {
    render(<PrinterAddPage />);
  });

  it('submits form', async () => {
    (fetchHelper as any).mockResolvedValue({
      json: async () => ({ id: 1 }),
    });

    const name = 'printer 1';
    const ip = '1.1.1.1';
    const port = 80;
    const proto = 'http';
    const type = 'octopi';
    const apiKey = '123456789';

    render(<PrinterAddPage />);

    userEvent.type(screen.getByPlaceholderText('Drukarka 1'), name);
    userEvent.type(screen.getByPlaceholderText('x.x.x.x'), ip);
    userEvent.type(screen.getByPlaceholderText('XXXXXXXXXXXXXXXXXXXXX'), apiKey);

    fireEvent.click(screen.getByText('Dodaj'));

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await waitFor(() => expect(fetchHelper).toHaveBeenCalledTimes(1));
    expect(fetchHelper).toHaveBeenCalledWith('/api/printer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        ip,
        port,
        proto,
        type,
        apiKey
      })
    });
    await screen.findByText('Dodaj kolejną drukarkę');


    fireEvent.click(screen.getByText('Dodaj kolejną drukarkę'));
    expect(screen.getByPlaceholderText('Drukarka 1')).toBeInTheDocument();
  });

  it('submits form - sets error', async () => {
    (fetchHelper as any).mockResolvedValue({
      json: async () => ({ id: null }),
    });

    const name = 'printer 1';
    const ip = '1.1.1.1';
    const port = 80;
    const proto = 'http';
    const type = 'octopi';
    const apiKey = '123456789';

    render(<PrinterAddPage />);

    userEvent.type(screen.getByPlaceholderText('Drukarka 1'), name);
    userEvent.type(screen.getByPlaceholderText('x.x.x.x'), ip);
    userEvent.type(screen.getByPlaceholderText('XXXXXXXXXXXXXXXXXXXXX'), apiKey);

    fireEvent.click(screen.getByText('Dodaj'));

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await waitFor(() => expect(fetchHelper).toHaveBeenCalledTimes(1));
    expect(fetchHelper).toHaveBeenCalledWith('/api/printer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        ip,
        port,
        proto,
        type,
        apiKey
      })
    });
    await screen.findByText('Nie udało się dodać drukarki');
  });
});
