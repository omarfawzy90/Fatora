import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; 

import HomeScreen from './screens/HomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import ProfileScreen from './screens/ProfileScreen';

// You can create this file as a placeholder for now
const RecentScreen = () => null; 

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Scan') {
            iconName = focused ? 'scan-circle' : 'scan-circle-outline';
          } else if (route.name === 'Recent') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#28a745', // Your app's green color
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // We will use custom headers in each screen
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen 
        name="Scan" 
        component={ScannerScreen} 
        // We can add a listener to open this as a modal if desired
      />
      <Tab.Screen name="Recent" component={RecentScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppTabs;