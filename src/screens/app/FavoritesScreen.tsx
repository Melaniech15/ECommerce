import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, useColorScheme,
} from 'react-native';
import { getFavorites, removeFavorite } from '../../services/favorites';
import { lightTheme, darkTheme } from '../../utils/theme';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface FavoritesScreenProps {
  navigation: any;
  token: string;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation, token }) => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const favoriteProducts = await getFavorites(token, { search: searchTerm });
      setFavorites(favoriteProducts);
    } catch (e) {
      console.error('Error loading favorites:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await removeFavorite(token, productId);
      setFavorites(prev => prev.filter(item => item.id !== productId));
    } catch (e) {
      console.error('Error removing favorite:', e);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  useEffect(() => {
    loadFavorites();
  }, [searchTerm]);

  const filteredFavorites = favorites.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        placeholder="Search Favorites"
        placeholderTextColor={theme.colors.placeholder}
        style={[styles.searchInput, { borderColor: theme.colors.border, color: theme.colors.text }]}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.favoriteItem, { borderColor: theme.colors.border }]}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ProductDetails', { productId: item.id, token })}
                style={styles.productInfo}
              >
                <Text style={[styles.productName, { color: theme.colors.text }]}>{item.name}</Text>
                <Text style={[styles.productPrice, { color: theme.colors.text }]}>${item.price.toFixed(2)}</Text>
                {item.description && (
                  <Text style={[styles.productDescription, { color: theme.colors.secondary }]}>
                    {item.description}
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleRemoveFavorite(item.id)}
                style={[styles.removeButton, { backgroundColor: theme.colors.primary }]}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.secondary }]}>
                {searchTerm ? 'No favorites match your search' : 'No favorites added yet'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  searchInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
  favoriteItem: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 8,
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default FavoritesScreen;