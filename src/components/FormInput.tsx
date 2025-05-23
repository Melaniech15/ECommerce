import React from 'react';
import { TextInput, StyleSheet, TextInputProps, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface FormInputProps extends TextInputProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const FormInput: React.FC<FormInputProps> = ({ style, textStyle, ...props }) => {
  const { theme } = useTheme();
  
  return (
    <TextInput
      style={[
        styles.input,
        { 
          backgroundColor: theme === 'light' ? '#f5f5f5' : '#333',
          color: theme === 'light' ? '#000' : '#fff',
          borderColor: theme === 'light' ? '#ccc' : '#555',
        },
        style,
        textStyle,
      ]}
      placeholderTextColor={theme === 'light' ? '#888' : '#aaa'}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
});
