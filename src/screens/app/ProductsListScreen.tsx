import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../context/ThemeContext';
import { AppStackParamList } from '../../navigation/types';
import { products } from '../../data/products';
import { Product } from '../../types';
import { darkTheme, lightTheme } from '../../utils/theme';

import LightHome from '../../assets/images/light/home.png';
import LightBrowse from '../../assets/images/light/browse.png';
import LightFavourites from '../../assets/images/light/favourites.png';
import LightCart from '../../assets/images/light/cart.png';
import LightProfile from '../../assets/images/light/profile.png';
import DarkMode from '../../assets/images/light/dark.png';
import LightMode from '../../assets/images/dark/light.png';
import LightLogout from '../../assets/images/light/logout.png';
import DarkHome from '../../assets/images/dark/home.png';
import DarkBrowse from '../../assets/images/dark/browse.png';
import DarkFavourites from '../../assets/images/dark/favourites.png';
import DarkCart from '../../assets/images/dark/cart.png';
import DarkProfile from '../../assets/images/dark/profile.png';
import DarkLogout from '../../assets/images/dark/logout.png';

type ProductsListScreenNavigationProp = StackNavigationProp<AppStackParamList, 'ProductsList'>;

export const ProductsListScreen = () => {
  const navigation = useNavigation<ProductsListScreenNavigationProp>();
  const { theme, toggleTheme } = useTheme();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleLogout = () => {
    console.log('User logged out');
  };

  const renderProductItem = ({ item }: { item: Product }) => {
    const isFavorite = favorites[item._id] || false;

    return (
      <TouchableOpacity
        style={[styles.productCard, { backgroundColor: currentTheme.card }]}
        onPress={() => navigation.navigate('ProductDetails', { productId: item._id })}
      >
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item._id)}
        >
        </TouchableOpacity>

        <View style={[styles.productImageContainer, { backgroundColor: currentTheme.card }]}>
          <Image
            source={{ uri: item.images[0]?.url }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.productInfo, { backgroundColor: currentTheme.background }]}>
          <Text style={[styles.name, { color: currentTheme.text }]}>{item.title}</Text>
          <Text style={[styles.price, { color: currentTheme.text }]}>
            ${item.price.toFixed(2)}
          </Text>
          <Text
            style={[styles.description, { color: currentTheme.text + '99' }]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBottomNavigation = () => {
    return (
      <View
        style={[
          styles.bottomNavigation,
          {
            backgroundColor: currentTheme.card,
            borderTopColor: currentTheme.border,
          },
        ]}
      >
        <TouchableOpacity style={styles.navItem}>
          <Image source={theme === 'dark' ? DarkHome : LightHome} style={styles.navIcon} />
          <Text style={[styles.navText, { color: currentTheme.text }]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Image source={theme === 'dark' ? DarkBrowse : LightBrowse} style={styles.navIcon} />
          <Text style={[styles.navText, styles.activeNavText, { color: currentTheme.text }]}>
            Browse
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <View style={styles.favCountContainer}>
            <Image source={theme === 'dark' ? DarkFavourites : LightFavourites} style={styles.navIcon} />
            <View style={styles.favCount}>
              <Text style={styles.favCountText}>6</Text>
            </View>
          </View>
          <Text style={[styles.navText, { color: currentTheme.text }]}>Favourites</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Image source={theme === 'dark' ? DarkCart : LightCart} style={styles.navIcon} />
          <Text style={[styles.navText, { color: currentTheme.text }]}>Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Image source={theme === 'dark' ? DarkProfile : LightProfile} style={styles.navIcon} />
          <Text style={[styles.navText, { color: currentTheme.text }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />

      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        columnWrapperStyle={styles.row}
      />

      {renderBottomNavigation()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeButton: {
    padding: 8,
  },
  logoutButton: {
    padding: 8,
    marginLeft: 8,
  },
  themeIcon: {
    width: 24,
    height: 24,
  },
  logoutIcon: {
    width: 24,
    height: 24,
  },
  productList: {
    padding: 8,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    padding: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
  },
  productImageContainer: {
    width: '100%',
    height: 170,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '90%',
    height: '90%',
  },
  productInfo: {
    padding: 12,
  },
  name: {
    fontFamily: 'Arial',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontFamily: 'Times New Roman',
    fontSize: 13,
    marginTop: 2,
  },
  bottomNavigation: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 20,
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    borderTopWidth: 0,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
  activeNavText: {
    fontWeight: '500',
  },
  favCountContainer: {
    position: 'relative',
  },
  favCount: {
    position: 'absolute',
    top: -5,
    right: -8,
    backgroundColor: '#888',
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favCountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
});

export default ProductsListScreen;
