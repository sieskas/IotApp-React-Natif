import React from 'react';
import {
    NavigationContainer,
    DefaultTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import { navigationRef } from './RootNavigation';

export type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    Home: undefined;
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
                <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Navigation;
