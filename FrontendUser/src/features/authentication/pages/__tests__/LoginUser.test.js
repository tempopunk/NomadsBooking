import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import LoginUser from '../LoginUser';
import { AuthProvider } from '../../context/AuthContext';

// Mock the API 
jest.mock('../../api/authApi', () => ({
  loginUser: jest.fn()
}));

// Wrap component with required providers
const renderLoginUser = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <LoginUser />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginUser Component', () => {
  test('renders login form elements', () => {
    renderLoginUser();
    
    // Check for form inputs
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    const loginButton = screen.getByRole('button', { name: /login$/i });

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test('renders login heading', () => {
    renderLoginUser();
    const heading = screen.getByRole('heading', { name: /login/i });
    expect(heading).toBeInTheDocument();
  });

  test('form inputs change value correctly', async () => {
    renderLoginUser();
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    
    await waitFor(() => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
    });
    
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  test('empty form submission shows required field validations', async () => {
    renderLoginUser();
    const loginButton = screen.getByRole('button', { name: /login$/i });
    const form = loginButton.closest('form');
    
    await waitFor(() => {
      fireEvent.submit(form);
    });

    // HTML5 validation will prevent form submission and show browser validations
    expect(form).toHaveAttribute('novalidate', '');
    expect(screen.getByLabelText(/email:/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/password:/i)).toHaveAttribute('required');
  });

  test('shows error message on failed login', async () => {
    const errorMessage = 'Invalid credentials';
    const mockLoginUser = jest.fn().mockRejectedValue(new Error(errorMessage));
    jest.spyOn(require('../../api/authApi'), 'loginUser').mockImplementation(mockLoginUser);

    renderLoginUser();
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    const loginButton = screen.getByRole('button', { name: /login$/i });

    await waitFor(() => {
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});