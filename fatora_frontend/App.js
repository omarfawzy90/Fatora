import React, { useContext } from 'react';
import { ActivityIndicator, View, Platform } from 'react-native';
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
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#28a745',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        {authState.isAuthenticated ? (
          <>
            {/* Main tab navigator */}
            <Stack.Screen 
              name="Main" 
              component={AppTabs} 
              options={{ headerShown: false }} 
            />
            {/* Modal screens with platform-specific configuration */}
            <Stack.Screen 
              name="Scanner" 
              component={ScannerScreen} 
              options={{ 
                title: 'Scan Barcode',
                headerShown: true,
                ...(Platform.OS === 'ios' && {
                  presentation: 'fullScreenModal',
                }),
              }} 
            />
            <Stack.Screen 
              name="AddProduct" 
              component={AddProductScreen} 
              options={{ 
                title: 'Add New Product',
                headerShown: true,
                ...(Platform.OS === 'ios' && {
                  presentation: 'fullScreenModal',
                }),
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