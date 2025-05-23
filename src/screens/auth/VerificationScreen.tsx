import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '../../components/Button';
import { OTPInput } from '../../components/OTPInput';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList, AuthStackParamList } from '../../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

type VerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Verification'>;

const verificationSchema = z.object({
  code: z.string().length(4, 'Code must be 4 digits'),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

export const VerificationScreen = () => {
  const navigation = useNavigation<VerificationScreenNavigationProp>();
  const { theme } = useTheme();
  const { login } = useAuth(); 

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = (data: VerificationFormData) => {
    console.log('Verification Code:', data.code);
    if (data.code === '1234') {
      login({
        email: 'test@example.com',
        password: ''
      }); 
      Alert.alert('Success', 'Account verified successfully!');
    } else {
      Alert.alert('Error', 'Invalid verification code. Please try again.');
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === 'light' ? '#fff' : '#121212' },
      ]}
    >
      <Text style={[styles.title, { color: theme === 'light' ? '#000' : '#fff' }]}>
        Verification
      </Text>
      <Text style={[styles.subtitle, { color: theme === 'light' ? '#666' : '#aaa' }]}>
        Enter the 4-digit code sent to your email
      </Text>

      <Controller
        control={control}
        name="code"
        render={({ field: { onChange, onBlur, value } }) => (
          <OTPInput
            length={4}
            onComplete={onChange} 
          />
        )}
      />
      {errors.code && <Text style={styles.errorText}>{errors.code.message}</Text>}

      <Button title="Verify" onPress={handleSubmit(onSubmit)} />
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
    errorText: {
    color: 'red',
    marginTop: 5,
    fontSize: 12,
  },
});

export default VerificationScreen;
