// __tests__/App.test.tsx

import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('react-native-config', () => ({
  ENV: 'test',
  API_URL: 'https://mock.api',
  USE_MOCKS: true,
}));

jest.mock('./../src/navigation', () => () => <></>);
jest.mock('./../src/components/Alert/AlertProvider', () => {
  return {
    AlertProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

describe('App.tsx', () => {
  it('should render without crashing and load providers', () => {
    const {toJSON } = render(<App />);
    expect(toJSON()).toBeTruthy(); // Ensure render is successful
  });
});
