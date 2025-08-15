import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import AccountDeletionDialog from '../AccountDeletionDialog';
import { getDeletionInfo, initiateAccountDeletion } from '../../../services/apiUser';

// Mock the API calls
jest.mock('../../../services/apiUser', () => ({
  getDeletionInfo: jest.fn(),
  initiateAccountDeletion: jest.fn()
}));

// Mock useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key // Return the key itself for testing
  })
}));

describe('AccountDeletionDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const mockDeletionInfo = {
    userId: 'user-123',
    email: 'test@example.com',
    fullName: 'John Doe',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-20T10:30:00Z',
    hasOrders: true,
    orderCount: 3,
    hasActiveOrders: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <AccountDeletionDialog
        isOpen={false}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.queryByText('deleteAccount.title')).not.toBeInTheDocument();
  });

  it('should render and fetch deletion info when opened', async () => {
    getDeletionInfo.mockResolvedValue(mockDeletionInfo);

    render(
      <AccountDeletionDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByText('deleteAccount.title')).toBeInTheDocument();
    expect(getDeletionInfo).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('should show loading state while fetching deletion info', () => {
    getDeletionInfo.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <AccountDeletionDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByText('deleteAccount.loadingInfo')).toBeInTheDocument();
  });

  it('should handle API error when fetching deletion info', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getDeletionInfo.mockRejectedValue(new Error('API Error'));

    render(
      <AccountDeletionDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching deletion info:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('should display order information when user has orders', async () => {
    getDeletionInfo.mockResolvedValue(mockDeletionInfo);

    render(
      <AccountDeletionDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('deleteAccount.orderHistory')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // order count
    });
  });

  it('should display no orders message when user has no orders', async () => {
    const noOrdersInfo = { ...mockDeletionInfo, hasOrders: false, orderCount: 0 };
    getDeletionInfo.mockResolvedValue(noOrdersInfo);

    render(
      <AccountDeletionDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('deleteAccount.noOrders')).toBeInTheDocument();
    });
  });

  it('should navigate through steps correctly', async () => {
    getDeletionInfo.mockResolvedValue(mockDeletionInfo);

    render(
      <AccountDeletionDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('deleteAccount.title')).toBeInTheDocument();
    });

    // Click next to go to step 2
    const nextButton = screen.getByText('deleteAccount.proceedToConfirm');
    fireEvent.click(nextButton);

    expect(screen.getByText('deleteAccount.confirmTitle')).toBeInTheDocument();

    // Click next to go to step 3
    const nextButton2 = screen.getByText('deleteAccount.proceedToFinalWarning');
    fireEvent.click(nextButton2);

    expect(screen.getByText('deleteAccount.finalWarningTitle')).toBeInTheDocument();
  });

  it('should go back through steps correctly', async () => {
    getDeletionInfo.mockResolvedValue(mockDeletionInfo);

    render(
      <AccountDeletionDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    await waitFor(() => {
      // Navigate to step 3
      fireEvent.click(screen.getByText('deleteAccount.proceedToConfirm'));
      fireEvent.click(screen.getByText('deleteAccount.proceedToFinalWarning'));
    });

    expect(screen.getByText('deleteAccount.finalWarningTitle')).toBeInTheDocument();

    // Go back to step 2
    const backButton = screen.getByText('deleteAccount.back');
    fireEvent.click(backButton);

    expect(screen.getByText('deleteAccount.confirmTitle')).toBeInTheDocument();
  });

  it('should require correct confirmation text to proceed', async () => {
    getDeletionInfo.mockResolvedValue(mockDeletionInfo);

    render(
      <AccountDeletionDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    await waitFor(() => {
      // Navigate to final step
      fireEvent.click(screen.getByText('deleteAccount.proceedToConfirm'));
      fireEvent.click(screen.getByText('deleteAccount.proceedToFinalWarning'));
    });

    const confirmInput = screen.getByPlaceholderText('deleteAccount.typePlaceholder');
    const confirmButton = screen.getByText('deleteAccount.confirmDeletion');

    // Try with wrong text
    fireEvent.change(confirmInput, { target: { value: 'wrong text' } });
    fireEvent.click(confirmButton);

    expect(initiateAccountDeletion).not.toHaveBeenCalled();

    // Try with correct text
    fireEvent.change(confirmInput, { target: { value: 'DELETE MY ACCOUNT' } });
    fireEvent.click(confirmButton);

    expect(initiateAccountDeletion).toHaveBeenCalled();
  });

  it('should handle successful account deletion', async () => {
    getDeletionInfo.mockResolvedValue(mockDeletionInfo);
    initiateAccountDeletion.mockResolvedValue({ success: true });

    render(
      <AccountDeletionDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    await waitFor(() => {
      // Navigate to final step and confirm
      fireEvent.click(screen.getByText('deleteAccount.proceedToConfirm'));
      fireEvent.click(screen.getByText('deleteAccount.proceedToFinalWarning'));
    });

    const confirmInput = screen.getByPlaceholderText('deleteAccount.typePlaceholder');
    const confirmButton = screen.getByText('deleteAccount.confirmDeletion');

    fireEvent.change(confirmInput, { target: { value: 'DELETE MY ACCOUNT' } });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should handle account deletion error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getDeletionInfo.mockResolvedValue(mockDeletionInfo);
    initiateAccountDeletion.mockRejectedValue(new Error('Deletion failed'));

    render(
      <AccountDeletionDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    await waitFor(() => {
      // Navigate to final step and confirm
      fireEvent.click(screen.getByText('deleteAccount.proceedToConfirm'));
      fireEvent.click(screen.getByText('deleteAccount.proceedToFinalWarning'));
    });

    const confirmInput = screen.getByPlaceholderText('deleteAccount.typePlaceholder');
    const confirmButton = screen.getByText('deleteAccount.confirmDeletion');

    fireEvent.change(confirmInput, { target: { value: 'DELETE MY ACCOUNT' } });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error initiating account deletion:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('should close dialog and reset state', () => {
    render(
      <AccountDeletionDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should show active orders warning', async () => {
    const activeOrdersInfo = { ...mockDeletionInfo, hasActiveOrders: true };
    getDeletionInfo.mockResolvedValue(activeOrdersInfo);

    render(
      <AccountDeletionDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('deleteAccount.activeOrdersWarning')).toBeInTheDocument();
    });
  });

  it('should handle loading state during deletion', async () => {
    getDeletionInfo.mockResolvedValue(mockDeletionInfo);
    initiateAccountDeletion.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <AccountDeletionDialog
        isOpen={true}
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
      />
    );

    await waitFor(() => {
      // Navigate to final step and confirm
      fireEvent.click(screen.getByText('deleteAccount.proceedToConfirm'));
      fireEvent.click(screen.getByText('deleteAccount.proceedToFinalWarning'));
    });

    const confirmInput = screen.getByPlaceholderText('deleteAccount.typePlaceholder');
    const confirmButton = screen.getByText('deleteAccount.confirmDeletion');

    fireEvent.change(confirmInput, { target: { value: 'DELETE MY ACCOUNT' } });
    fireEvent.click(confirmButton);

    // Should show loading state during deletion
    await waitFor(() => {
      expect(screen.getByText('deleteAccount.loadingInfo')).toBeInTheDocument();
    });
  });
});
