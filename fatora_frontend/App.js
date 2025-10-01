import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import AppTabs from './src/AppTabs'; 
import OnboardingScreen from './src/screens/OnboardingScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import ScannerScreen from './src/screens/ScannerScreen';
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
          <>
            {/* Main tab navigator */}
            <Stack.Screen 
              name="Main" 
              component={AppTabs} 
              options={{ headerShown: false }} 
            />
            {/* Modal screens that can be accessed from anywhere */}
            <Stack.Screen 
              name="Scanner" 
              component={ScannerScreen} 
              options={{ 
                title: 'Scan Barcode',
                presentation: 'modal',
                headerShown: true 
              }} 
            />
            <Stack.Screen 
              name="AddProduct" 
              component={AddProductScreen} 
              options={{ 
                title: 'Add New Product',
                presentation: 'modal',
                headerShown: true 
              }} 
            />
          </>
        ) : (
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