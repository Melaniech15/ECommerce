import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ProductCard } from '../../components/ProductCard';
import { products } from '../../data/products';
import { useNavigation } from '@react-navigation/native';
import { AppStackParamList } from '../../navigation/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../context/ThemeContext';

type ProductsListScreenNavigationProp = StackNavigationProp<AppStackParamList, 'ProductsList'>;

export const ProductsListScreen = () => {
  const navigation = useNavigation<ProductsListScreenNavigationProp>();
  const { theme } = useTheme();

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme === 'light' ? '#f5f5f5' : '#121212' },
    ]}>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        numColumns={2}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetails', { productId: item._id })}
            style={{ width: '45%' }}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 10,
  },
});