import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface OTPInputProps {
  length?: number;
  onComplete: (code: string) => void;
  style?: TextStyle;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 4, onComplete, style }) => {
  const [code, setCode] = useState<string[]>(Array(length).fill(''));
  const inputs = useRef<(TextInput | null)[]>(Array(length).fill(null));
  const { theme } = useTheme();

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (newCode.every(num => num)) {
      onComplete(newCode.join(''));
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      {Array(length).fill(0).map((_, index) => (
        <TextInput
          key={index}
          ref={ref => { inputs.current[index] = ref; }}
          style={[
            styles.input,
            { 
              color: theme === 'light' ? '#000' : '#fff',
              borderColor: theme === 'light' ? '#6200ee' : '#bb86fc',
            },
            style,
          ]}
          keyboardType="number-pad"
          maxLength={1}
          value={code[index]}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  input: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
  },
});