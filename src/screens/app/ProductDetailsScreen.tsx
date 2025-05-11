import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { products } from '../../data/products';
import { Button } from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../../navigation/types';

type ProductDetailsScreenRouteProp = RouteProp<AppStackParamList, 'ProductDetails'>;

interface ProductDetailsScreenProps {
  route: ProductDetailsScreenRouteProp;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ route }) => {
  const { productId } = route.params;
  const product = products.find(p => p._id === productId);
  const { theme } = useTheme();

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: theme === 'light' ? '#fff' : '#121212' }]}>
        <Text style={{ color: theme === 'light' ? '#000' : '#fff' }}>Product not found</Text>
      </View>
    );
  }

  const handleShare = () => {
    // Share functionality would go here
    alert('Share product: ' + product.title);
  };

  const handleAddToCart = () => {
    // Add to cart functionality would go here
    alert('Added to cart: ' + product.title);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme === 'light' ? '#fff' : '#121212' }]}
      contentContainerStyle={styles.content}
    >
      <Image 
        source={{ uri: product.images[0].url }} 
        style={styles.image}
        resizeMode="contain"
      />
      
      <View style={styles.details}>
        <Text style={[styles.title, { color: theme === 'light' ? '#000' : '#fff' }]}>
          {product.title}
        </Text>
        
        <Text style={[styles.price, { color: theme === 'light' ? '#6200ee' : '#bb86fc' }]}>
          ${product.price}
        </Text>
        
        <Text style={[styles.description, { color: theme === 'light' ? '#666' : '#aaa' }]}>
          {product.description}
        </Text>
      </View>
      
      <View style={styles.buttons}>
        <Button 
          title="Share" 
          onPress={handleShare} 
          style={{ backgroundColor: theme === 'light' ? '#03dac6' : '#018786' }}
        />
        <Button 
          title="Add to Cart" 
          onPress={handleAddToCart} 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
  },
  details: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttons: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
});

function alert(arg0: string) {
    throw new Error('Function not implemented.');
}
