// src/screens/OnboardingScreen.js
import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const OnboardingScreen = () => {
  const [isLogin, setIsLogin] = useState(true); // To toggle between Login and Register
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useContext(AuthContext);

  const handleAuthAction = async () => {
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(firstName, lastName, email, password, passwordConfirmation);
      }
    } catch (error) {
      Alert.alert('Authentication Failed', 'Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Welcome Back!' : 'Create Account'}</Text>

      {!isLogin && (
        <>
          <TextInput style={styles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
          <TextInput style={styles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
        </>
      )}

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      {!isLogin && (
        <TextInput style={styles.input} placeholder="Confirm Password" value={passwordConfirmation} onChangeText={setPasswordConfirmation} secureTextEntry />
      )}

      <TouchableOpacity style={styles.button} onPress={handleAuthAction} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.toggleText}>
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Add styles (you can customize these later)
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
    input: { height: 50, borderColor: 'gray', borderWidth: 1, borderRadius: 8, marginBottom: 15, paddingHorizontal: 15 },
    button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    toggleText: { color: '#007bff', textAlign: 'center', marginTop: 20 },
});


export default OnboardingScreen;