import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import AdminRegistrationForm from '../AdminRegistrationForm';
import { registerAdmin } from '../../../services/apiAdmin';

// Mock the API calls
jest.mock('../../../services/apiAdmin', () => ({
  registerAdmin: jest.fn()
}));

// Mock useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key // Return the key itself for testing
  })
}));

describe('AdminRegistrationForm', () => {
  const mockOnSuccess = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form with all required fields', () => {
    render(
      <AdminRegistrationForm
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText('admin.createNewAdmin')).toBeInTheDocument();
    expect(screen.getByLabelText('admin.email')).toBeInTheDocument();
    expect(screen.getByLabelText('admin.password')).toBeInTheDocument();
    expect(screen.getByLabelText('admin.name')).toBeInTheDocument();
    expect(screen.getByLabelText('admin.surname')).toBeInTheDocument();
    expect(screen.getByLabelText('admin.phone')).toBeInTheDocument();
    expect(screen.getByLabelText('admin.dob')).toBeInTheDocument();
  });

  it('should update form data when user types', () => {
    render(<AdminRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const emailInput = screen.getByLabelText('admin.email');
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });

    expect(emailInput.value).toBe('admin@example.com');
  });

  it('should show validation errors for invalid email', async () => {
    render(<AdminRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const emailInput = screen.getByLabelText('admin.email');
    const submitButton = screen.getByText('admin.createAdmin');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('validation.invalidEmail')).toBeInTheDocument();
    });
  });

  it('should show validation errors for weak password', async () => {
    render(<AdminRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const passwordInput = screen.getByLabelText('admin.password');
    const submitButton = screen.getByText('admin.createAdmin');

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('validation.passwordTooShort')).toBeInTheDocument();
    });
  });

  it('should show validation errors for required fields', async () => {
    render(<AdminRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const submitButton = screen.getByText('admin.createAdmin');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('validation.emailRequired')).toBeInTheDocument();
      expect(screen.getByText('validation.passwordRequired')).toBeInTheDocument();
      expect(screen.getByText('validation.nameRequired')).toBeInTheDocument();
      expect(screen.getByText('validation.surnameRequired')).toBeInTheDocument();
    });
  });

  it('should validate phone number format', async () => {
    render(<AdminRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const phoneInput = screen.getByLabelText('admin.phone');
    const submitButton = screen.getByText('admin.createAdmin');

    fireEvent.change(phoneInput, { target: { value: 'invalid-phone' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('validation.invalidPhone')).toBeInTheDocument();
    });
  });

  it('should validate date of birth', async () => {
    render(<AdminRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const dobInput = screen.getByLabelText('admin.dob');
    const submitButton = screen.getByText('admin.createAdmin');

    // Set future date
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];

    fireEvent.change(dobInput, { target: { value: futureDateString } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('validation.invalidDob')).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const mockResponse = { success: true, accessToken: 'token' };
    registerAdmin.mockResolvedValue(mockResponse);

    render(<AdminRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('admin.email'), { 
      target: { value: 'admin@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('admin.password'), { 
      target: { value: 'SecurePassword123!' } 
    });
    fireEvent.change(screen.getByLabelText('admin.name'), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByLabelText('admin.surname'), { 
      target: { value: 'Doe' } 
    });
    fireEvent.change(screen.getByLabelText('admin.phone'), { 
      target: { value: '+1234567890' } 
    });
    fireEvent.change(screen.getByLabelText('admin.dob'), { 
      target: { value: '1990-01-01' } 
    });

    const submitButton = screen.getByText('admin.createAdmin');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(registerAdmin).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'SecurePassword123!',
        name: 'John',
        surname: 'Doe',
        phone: '+1234567890',
        dob: '1990-01-01'
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(mockResponse);
    });
  });

  it('should show loading state during submission', async () => {
    registerAdmin.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<AdminRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    // Fill out valid form data
    fireEvent.change(screen.getByLabelText('admin.email'), { 
      target: { value: 'admin@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('admin.password'), { 
      target: { value: 'SecurePassword123!' } 
    });
    fireEvent.change(screen.getByLabelText('admin.name'), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByLabelText('admin.surname'), { 
      target: { value: 'Doe' } 
    });

    const submitButton = screen.getByText('admin.createAdmin');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('admin.creatingAdmin')).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
    });
  });

  it('should handle email already exists error', async () => {
    const mockError = { status: 409, error: 'Email already exists' };
    registerAdmin.mockRejectedValue(mockError);

    render(<AdminRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    // Fill out the form and submit
    fireEvent.change(screen.getByLabelText('admin.email'), { 
      target: { value: 'existing@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('admin.password'), { 
      target: { value: 'SecurePassword123!' } 
    });
    fireEvent.change(screen.getByLabelText('admin.name'), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByLabelText('admin.surname'), { 
      target: { value: 'Doe' } 
    });

    fireEvent.click(screen.getByText('admin.createAdmin'));

    await waitFor(() => {
      expect(screen.getByText('validation.emailExists')).toBeInTheDocument();
    });
  });

  it('should handle unauthorized error', async () => {
    const mockError = { status: 401, error: 'Unauthorized' };
    registerAdmin.mockRejectedValue(mockError);

    render(<AdminRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    // Fill and submit form
    fireEvent.change(screen.getByLabelText('admin.email'), { 
      target: { value: 'admin@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('admin.password'), { 
      target: { value: 'SecurePassword123!' } 
    });
    fireEvent.change(screen.getByLabelText('admin.name'), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByLabelText('admin.surname'), { 
      target: { value: 'Doe' } 
    });

    fireEvent.click(screen.getByText('admin.createAdmin'));

    await waitFor(() => {
      expect(screen.getByText('admin.notAuthorized')).toBeInTheDocument();
    });
  });

  it('should handle insufficient permissions error', async () => {
    const mockError = { status: 403, error: 'Insufficient permissions' };
    registerAdmin.mockRejectedValue(mockError);

    render(<AdminRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    // Fill and submit form
    fireEvent.change(screen.getByLabelText('admin.email'), { 
      target: { value: 'admin@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('admin.password'), { 
      target: { value: 'SecurePassword123!' } 
    });
    fireEvent.change(screen.getByLabelText('admin.name'), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByLabelText('admin.surname'), { 
      target: { value: 'Doe' } 
    });

    fireEvent.click(screen.getByText('admin.createAdmin'));

    await waitFor(() => {
      expect(screen.getByText('admin.insufficientPermissions')).toBeInTheDocument();
    });
  });

  it('should handle generic errors', async () => {
    const mockError = { error: 'Something went wrong' };
    registerAdmin.mockRejectedValue(mockError);

    render(<AdminRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    // Fill and submit form
    fireEvent.change(screen.getByLabelText('admin.email'), { 
      target: { value: 'admin@example.com' } 
    });
    fireEvent.change(screen.getByLabelText('admin.password'), { 
      target: { value: 'SecurePassword123!' } 
    });
    fireEvent.change(screen.getByLabelText('admin.name'), { 
      target: { value: 'John' } 
    });
    fireEvent.change(screen.getByLabelText('admin.surname'), { 
      target: { value: 'Doe' } 
    });

    fireEvent.click(screen.getByText('admin.createAdmin'));

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  it('should clear errors when user starts typing', async () => {
    render(<AdminRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    // Trigger validation error
    const submitButton = screen.getByText('admin.createAdmin');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('validation.emailRequired')).toBeInTheDocument();
    });

    // Start typing in email field
    const emailInput = screen.getByLabelText('admin.email');
    fireEvent.change(emailInput, { target: { value: 'a' } });

    // Error should be cleared
    expect(screen.queryByText('validation.emailRequired')).not.toBeInTheDocument();
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<AdminRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText('admin.cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should reset form after successful submission', async () => {
    const mockResponse = { success: true };
    registerAdmin.mockResolvedValue(mockResponse);

    render(<AdminRegistrationForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />);

    const emailInput = screen.getByLabelText('admin.email');
    const passwordInput = screen.getByLabelText('admin.password');

    // Fill out the form
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'SecurePassword123!' } });
    fireEvent.change(screen.getByLabelText('admin.name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText('admin.surname'), { target: { value: 'Doe' } });

    fireEvent.click(screen.getByText('admin.createAdmin'));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(emailInput.value).toBe('');
      expect(passwordInput.value).toBe('');
    });
  });
});
