import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;

export const SignupScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { theme } = useTheme();

  const handleSignup = () => {
    // In a real app, you would validate and send to backend
    Alert.alert('Success', 'Account created successfully');
    navigation.navigate('Verification');
  };

  return (
    <ScrollView 
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme === 'light' ? '#fff' : '#121212' },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: theme === 'light' ? '#000' : '#fff' }]}>Create Account</Text>
      
      <FormInput
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      
      <FormInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <FormInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <FormInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      
      <Button title="Sign Up" onPress={handleSignup} />
      
      <Text 
        style={[styles.footerText, { color: theme === 'light' ? '#000' : '#fff' }]}
        onPress={() => navigation.navigate('Login')}
      >
        Already have an account? Login
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});