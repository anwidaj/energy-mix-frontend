import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../pages/index';
import axios from 'axios';

// Mock of axios
jest.mock('axios');

describe('Energy Mix Dashboard', () => {
    it('Should display the title of the page correctly', () => {
        axios.get.mockResolvedValue({
            data: {
                days: [],
                start: "2026-06-21T11:00Z",
                end: "2026-06-21T13:00Z",
                cleanEnergyPerc: 50.0
            }
        });

        // Render main page
        render(<Home />);

        // Expect to display the title
        const heading = screen.getByText(/Energy Mix Dashboard/i);
        expect(heading).toBeInTheDocument();
    });
});

it('Should call API when Calculate button is clicked with valid hours', async () => {
    // Set Java Server simulation
    axios.get.mockResolvedValue({
        data: {
            days: [],
            start: "2026-06-21T11:00Z",
            end: "2026-06-21T13:00Z",
            cleanEnergyPerc: 50.0
        }
    });
    // Render page
    render(<Home />);
    // Find the window for entering hours and the "Calculate" button
    const input = screen.getByRole('spinbutton');
    const button = screen.getByRole('button', { name: /Calculate/i });
    // Enter the number '3' from the keyboard
    fireEvent.change(input, { target: { value: '3' } });
    // Click the button
    fireEvent.click(button);
    // Check if React correctly hit Java for data for 3 hours
    expect(axios.get).toHaveBeenCalledWith('http://localhost:8081/api/charging-window?hours=3');
});
