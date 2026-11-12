import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

// Mock auth context
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    login: vi.fn(),
    isAuthenticated: false,
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}));

// Mock API module
vi.mock('../../utils/api/common', () => ({
  default: {
    get: vi.fn().mockRejectedValue(new Error('unauthenticated')),
  },
}));

const renderWithRouter = (ui) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('LoginPage', () => {
  it('renders login form with email and password inputs', () => {
    renderWithRouter(<LoginPage />);

    expect(screen.getByText(/email atau nomor handphone admin/i)).toBeInTheDocument();
    expect(screen.getByText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /masuk ke dashboard/i })).toBeInTheDocument();
  });

  it('shows error message when form is submitted with empty fields', async () => {
    renderWithRouter(<LoginPage />);

    fireEvent.click(screen.getByRole('button', { name: /masuk ke dashboard/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/email\/nomor handphone dan password wajib diisi/i)
      ).toBeInTheDocument();
    });
  });
});
