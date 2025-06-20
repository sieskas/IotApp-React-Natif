import React from 'react';
import {
    NavigationContainer,
    DefaultTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import LocationsScreen from '../screens/LocationsScreen';
import AddLocationScreen from '../screens/AddLocationScreen';
import LocationDetailsScreen from '../screens/LocationDetailsScreen';
import AddDeviceScreen from '../screens/AddDeviceScreen';
import DeviceDetailsScreen from '../screens/DeviceDetailsScreen';
import { navigationRef } from './RootNavigation';

export type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    Locations: undefined;
    AddLocation: undefined;
    LocationDetails: { locationId: string };
    AddDevice: { locationId: string };
    DeviceDetails: { deviceId: string };
};

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#1A1A1A',
        card: '#1A1A1A',
        text: '#FFFFFF',
        border: '#333333',
        primary: '#2979FF',
    },
};

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
    return (
        <NavigationContainer ref={navigationRef} theme={MyTheme}>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShown: false,
                    cardStyle: { backgroundColor: '#1A1A1A' },
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="Locations" component={LocationsScreen} />
                <Stack.Screen name="AddLocation" component={AddLocationScreen} />
                <Stack.Screen name="LocationDetails" component={LocationDetailsScreen} />
                <Stack.Screen name="AddDevice" component={AddDeviceScreen} />
                <Stack.Screen name="DeviceDetails" component={DeviceDetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
