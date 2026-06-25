import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import RechargeScreen from '../screens/Recharge/RechargeScreen';
import NFCReaderScreen from '../screens/NFC/NFCReaderScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import BalanceScreen from '../screens/Balance/BalanceScreen';
import TravelHistoryScreen from '../screens/TravelHistory/TravelHistoryScreen';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Main: undefined; // Nome usado no replace
  Home: undefined;
  Recharge: undefined;
  NFC: undefined;
  Profile: undefined;
  Balance: undefined;
  TravelHistory: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'fade', // Transição mais suave e profissional
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        {/* Telas principais */}
        <Stack.Screen name="Main" component={HomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Recharge" component={RechargeScreen} />
        <Stack.Screen name="NFC" component={NFCReaderScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Balance" component={BalanceScreen} />
        <Stack.Screen name="TravelHistory" component={TravelHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
