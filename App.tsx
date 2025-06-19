// App.tsx
import React from 'react';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from './src/components/Alert/AlertProvider';
import Navigation from './src/navigation';
import Config from 'react-native-config';

const App = () => {
  console.log('=== ENVIRONMENT DEBUG ===');
  console.log('ENV:', Config.ENV);
  console.log('API_URL:', Config.API_URL);
  console.log('USE_MOCKS:', Config.USE_MOCKS);
  console.log('========================');

  return (
    <SafeAreaProvider>
      <AlertProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#1A1A1A"
          translucent={Platform.OS === 'android'}
        />
        <Navigation />
      </AlertProvider>
    </SafeAreaProvider>
  );
};

export default App;
