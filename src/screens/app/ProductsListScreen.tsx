import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, useColorScheme,
} from 'react-native';
import { Product, ProductInput, addProduct, getProducts } from '../../services/products';
import { lightTheme, darkTheme } from '../../utils/theme';

interface ProductsListScreenProps {
  navigation: any;
  token: string;
}

const ProductsListScreen: React.FC<ProductsListScreenProps> = ({ navigation, token }) => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');

  const loadProducts = async () => {
    setLoading(true);
    try {
      const allProducts = await getProducts(token, { page, search: searchTerm, sortBy });
      setProducts(allProducts.items as unknown as Product[]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, searchTerm, sortBy]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        placeholder="Search Products"
        placeholderTextColor={theme.colors.placeholder}
        style={[styles.searchInput, { borderColor: theme.colors.border, color: theme.colors.text }]}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <View style={styles.sortContainer}>
        <TouchableOpacity onPress={() => setSortBy('name')}>
          <Text style={{ color: sortBy === 'name' ? theme.colors.primary : theme.colors.text }}>Sort by Name</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortBy('price')}>
          <Text style={{ color: sortBy === 'price' ? theme.colors.primary : theme.colors.text }}>Sort by Price</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('ProductDetails', { productId: item.id, token })}
              style={[styles.productItem, { borderColor: theme.colors.border }]}
            >
              <Text style={{ color: theme.colors.text }}>{item.name}</Text>
              <Text style={{ color: theme.colors.text }}>${item.price.toFixed(2)}</Text>
            </TouchableOpacity>
          )}
          onEndReached={() => setPage((p) => p + 1)}
          onEndReachedThreshold={0.5}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  searchInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  productItem: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 8,
  },
});

export default ProductsListScreen;
