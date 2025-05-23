import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from '../../components/Button';
import { FormInput } from '../../components/FormInput';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

type SignupScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Signup'>;
const signupSchema = z.object({
  name: z.string().min(3, 'Full Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone Number is required').max(15, 'Phone Number is too long'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const { theme } = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const onSubmit = (data: SignupFormData) => {
    console.log('Signup Data:', data);
    Alert.alert('Success', 'Account created successfully. Please verify your email.');
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
      <Text style={[styles.title, { color: theme === 'light' ? '#000' : '#fff' }]}>
        Create Account
      </Text>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput placeholder="Full Name" value={value} onChangeText={onChange} onBlur={onBlur} />
        )}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        )}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry
          />
        )}
      />
      {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, onBlur, value } }) => (
          <FormInput
            placeholder="Phone Number"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType="phone-pad"
          />
        )}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}

      <Button title="Sign Up" onPress={handleSubmit(onSubmit)} />

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
    fontFamily: 'San Francisco',
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
    errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12,
  },
});
