/* eslint-disable testing-library/no-debugging-utils, testing-library/no-node-access, testing-library/no-container */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrinterNewPrintPage } from ".";
import { fetchHelper } from '../../utils/fetch';

jest.mock('../../utils/fetch');

class ResizeObserver {
  observe() {}
  unobserve() {}
}

(window as any).ResizeObserver = ResizeObserver;

describe('PrinterNewPrintPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    (fetchHelper as any).mockResolvedValue({
      json: async () => ({ printers: []}),
    });

    render(<PrinterNewPrintPage />);
  });

  it('loads printers', () => {
    (fetchHelper as any).mockResolvedValue({
      json: async () => ({ printers: []}),
    });

    render(<PrinterNewPrintPage />);

    expect(fetchHelper).toHaveBeenCalledTimes(1);
  });

  it('submits form', async () => {
    const name = 'printer 1';
    const file = new File([], 'test.gcode', { type: 'text/x.gcode' });

    (fetchHelper as any).mockImplementation(async () => ({
      status: 200,
      json: async () => ({ printers: [{
        id: 1,
        name,
      }] }),
    }));



    const { container } = render(<PrinterNewPrintPage />);

    userEvent.upload(container.querySelector('input[type="file"]') as any, file);

    fireEvent.click(screen.getByText('Dodaj'));

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await waitFor(() => expect(fetchHelper).toHaveBeenCalledTimes(2));
    await screen.findByText('Dodaj kolejny druk');

    fireEvent.click(screen.getByText('Dodaj kolejny druk'));
    expect(screen.getByText('Dodaj')).toBeInTheDocument();
  });
});
