import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageStyle, ViewStyle, TextStyle } from 'react-native';
import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onPress, style, imageStyle, textStyle }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: theme === 'light' ? '#fff' : '#333' },
        style,
      ]}
      onPress={onPress}
    >
      <Image 
        source={{ uri: product.images[0].url }} 
        style={[styles.image, imageStyle]}
        resizeMode="cover"
      />
      <View style={styles.details}>
        <Text 
          style={[
            styles.title, 
            { color: theme === 'light' ? '#000' : '#fff' },
            textStyle,
          ]}
        >
          {product.title}
        </Text>
        <Text 
          style={[
            styles.price, 
            { color: theme === 'light' ? '#6200ee' : '#bb86fc' },
            textStyle,
          ]}
        >
          ${product.price}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    overflow: 'hidden',
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: '100%',
    height: 150,
  },
  details: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
  },
});
