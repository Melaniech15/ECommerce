import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../../components/Button';
import { OTPInput } from '../../components/OTPInput';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

type VerificationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;

export const VerificationScreen = () => {
  const [code, setCode] = useState('');
  const navigation = useNavigation<VerificationScreenNavigationProp>();
  const { theme } = useTheme();
  const { login } = useAuth();

  const handleVerification = () => {
    if (code.length === 4) {
      login('eurisko', 'academy2025'); 
      navigation.navigate('App'); 
    } else {
      Alert.alert('Error', 'Please enter a valid 4-digit code');
    }
  };

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme === 'light' ? '#fff' : '#121212' },
    ]}>
      <Text style={[styles.title, { color: theme === 'light' ? '#000' : '#fff' }]}>
        Verification
      </Text>
      <Text style={[styles.subtitle, { color: theme === 'light' ? '#666' : '#aaa' }]}>
        Enter the 4-digit code sent to your email
      </Text>
      
      <OTPInput 
        length={4} 
        onComplete={setCode} 
      />
      
      <Button 
        title="Verify" 
        onPress={handleVerification} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'San Francisco',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
});

export default VerificationScreen;
