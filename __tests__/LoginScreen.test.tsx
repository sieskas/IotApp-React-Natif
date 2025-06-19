import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';

const mockShowError = jest.fn(); // ✅ autorisé car préfixé par 'mock'

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), replace: jest.fn() }),
}));

jest.mock('../src/hooks/useApi', () => () => ({
  loading: false,
  error: null,
  loginUser: jest.fn().mockResolvedValue({ success: false }),
  resetState: jest.fn(),
}));

jest.mock('../src/hooks/useAlert', () => ({
  useAlert: () => ({
    showError: mockShowError,
    showSuccess: jest.fn(),
  }),
}));

jest.mock('../src/utils/environment', () => ({
  getCurrentEnvironment: () => 'test',
}));

describe('LoginScreen', () => {
  it('should show error if username or password is missing', async () => {
    const { getByTestId } = render(<LoginScreen />);
    const loginButton = getByTestId('login-button');

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        "Veuillez saisir votre nom d'utilisateur et votre mot de passe"
      );
    });
  });
});
