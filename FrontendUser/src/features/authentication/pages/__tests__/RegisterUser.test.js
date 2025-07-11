import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import RegisterUser from '../RegisterUser';

// Mock the API
jest.mock('../../api/authApi', () => ({
  registerUser: jest.fn()
}));

const renderRegisterUser = () => {
  return render(
    <BrowserRouter>
      <RegisterUser />
    </BrowserRouter>
  );
};

describe('RegisterUser Component', () => {
  test('renders registration form elements', () => {
    renderRegisterUser();
    
    const nameInput = screen.getByLabelText(/name:/i);
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/^password:/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password:/i);
    const registerButton = screen.getByRole('button', { name: /register$/i });

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
  });

  test('renders register heading', () => {
    renderRegisterUser();
    const heading = screen.getByRole('heading', { name: /register/i });
    expect(heading).toBeInTheDocument();
  });

  test('form inputs change value correctly', async () => {
    renderRegisterUser();
    const nameInput = screen.getByLabelText(/name:/i);
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/^password:/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password:/i);
    
    await waitFor(() => {
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    });
    
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('password123');
    expect(confirmPasswordInput.value).toBe('password123');
  });

  test('validates required fields on empty form submission', async () => {
    renderRegisterUser();
    const registerButton = screen.getByRole('button', { name: /register$/i });
    const form = registerButton.closest('form');
    
    await waitFor(() => {
      fireEvent.submit(form);
    });

    expect(screen.getByLabelText(/name:/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/email:/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/^password:/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/confirm password:/i)).toHaveAttribute('required');
  });

  test('shows error for non-matching passwords', async () => {
    renderRegisterUser();
    const passwordInput = screen.getByLabelText(/^password:/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password:/i);
    const registerButton = screen.getByRole('button', { name: /register$/i });

    await waitFor(() => {
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
      fireEvent.click(registerButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    });

    // Fix the passwords to match
    await waitFor(() => {
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
    });

    // Error message should disappear
    await waitFor(() => {
      expect(screen.queryByText('Passwords do not match.')).not.toBeInTheDocument();
    });
  });

  test('shows success message on successful registration', async () => {
    const successMessage = 'User registered successfully!';
    const mockRegisterUser = jest.fn().mockResolvedValue(successMessage);
    jest.spyOn(require('../../api/authApi'), 'registerUser').mockImplementation(mockRegisterUser);

    renderRegisterUser();
    const nameInput = screen.getByLabelText(/name:/i);
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/^password:/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password:/i);
    const registerButton = screen.getByRole('button', { name: /register$/i });

    await waitFor(() => {
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } });
      fireEvent.click(registerButton);
    });

    await waitFor(() => {
      expect(screen.getByText(successMessage)).toBeInTheDocument();
    });
  });
});