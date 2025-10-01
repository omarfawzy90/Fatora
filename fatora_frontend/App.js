import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import AppTabs from './src/AppTabs'; 
import OnboardingScreen from './src/screens/OnboardingScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import { enableScreens } from 'react-native-screens';

enableScreens();


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { authState } = useContext(AuthContext);

  if (authState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#28a745" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {authState.isAuthenticated ? (
          // When logged in, the main component is the Tab Navigator,
          // and the AddProduct screen is available on top of it.
          <>
            <Stack.Screen name="Main" component={AppTabs} options={{ headerShown: false }} />
            <Stack.Screen name="AddProduct" component={AddProductScreen} options={{ title: 'Add New Product' }} />
          </>
        ) : (
          // When logged out, only show the onboarding screen
          <Stack.Screen
            name="Onboarding"
            component={OnboardingScreen}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
};

export default App;