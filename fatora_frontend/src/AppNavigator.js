import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthContext } from './context/AuthContext';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';

const AppNavigator = () => {
  const { authState } = useContext(AuthContext);

  if (authState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return authState.isAuthenticated ? <HomeScreen /> : <OnboardingScreen />;
};

export default AppNavigator;