import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { products } from '../../data/products';
import { useTheme } from '../../context/ThemeContext';
import { RouteProp } from '@react-navigation/native';
import { AppStackParamList } from '../../navigation/types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import LightHome from '../../assets/images/light/home.png';
import LightBrowser from '../../assets/images/light/browse.png';
import LightFavourites from '../../assets/images/light/favourites.png';
import LightCart from '../../assets/images/light/cart.png';
import LightProfile from '../../assets/images/light/profile.png';
import DarkMode from '../../assets/images/light/dark.png';
import LightMode from '../../assets/images/dark/light.png';
import DarkHome from '../../assets/images/dark/home.png';
import DarkBrowse from '../../assets/images/dark/browse.png';
import DarkFavourites from '../../assets/images/dark/favourites.png';
import DarkCart from '../../assets/images/dark/cart.png';
import DarkProfile from '../../assets/images/dark/profile.png';
import { darkTheme, lightTheme } from '../../utils/theme';

type ProductDetailsScreenRouteProp = RouteProp<AppStackParamList, 'ProductDetails'>;

interface ProductDetailsScreenProps {
  route: ProductDetailsScreenRouteProp;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({ route }) => {
  const { productId } = route.params;
  const product = products.find(p => p._id === productId);
  const { theme } = useTheme();
  const navigation = useNavigation();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const colors = {
    background: theme === 'light' ? '#fff' : '#121212',
    headerBackground: theme === 'light' ? '#fff' : '#1e1e1e',
    text: theme === 'light' ? '#000' : '#fff',
    secondaryText: theme === 'light' ? '#888' : '#aaa',
    tabBackground: theme === 'light' ? '#fff' : '#121212',
    tabBorder: theme === 'light' ? '#eee' : '#333',
    imageBackground: theme === 'light' ? '#f5f5f5' : '#1e1e1e',
    activeTab: theme === 'light' ? '#000' : '#fff',
    inactiveTab: theme === 'light' ? '#777' : '#777',
  };

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Product not found</Text>
      </View>
    );
  }

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      

      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        {}
        <View style={[styles.imageContainer, { backgroundColor: colors.imageBackground }]}>
          <Image 
            source={{ uri: product.images[0]?.url || 'https://fdn2.gsmarena.com/vv/pics/sony/sony-xperia-1-v-1.jpg' }} 
            style={styles.image} 
            resizeMode="contain" 
          />
        </View>

        {}
        <View style={styles.details}>
          <Text style={[styles.title, { color: colors.text }]}>
            {product.title}
          </Text>
          
          <Text style={[styles.price, { color: colors.text }]}>
            ${product.price.toFixed(2)}
          </Text>
          
          <Text style={[styles.description, { color: colors.secondaryText }]}>
            {product.description}
          </Text>
        </View>

        {}
        <View style={{ height: 80 }} />
      </ScrollView>

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
          <Image source={theme === 'dark' ? DarkBrowse : LightBrowser} style={styles.navIcon} />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1,
  },
  container: { 
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 56,
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  imageContainer: { 
    borderRadius: 20, 
    margin: 16, 
    padding: 20,
    alignItems: 'center', 
    position: 'relative',
    justifyContent: 'center', 
  },
  image: { 
    width: '100%', 
    height: 300, 
  },
  details: { 
    paddingHorizontal: 24, 
    paddingTop: 8 
  },
  price: { 
    fontWeight: 'bold', 
    fontSize: 28, 
    marginTop: 8,
    fontFamily: 'System',
  },
  title: { 
    fontWeight: 'bold', 
    fontSize: 22, 
    marginTop: 8,
    marginBottom: 4,
  },
  backButton: {
    padding: 8,
  },
  description: { 
    fontSize: 15, 
    marginTop: 8, 
    lineHeight: 22,
    fontFamily: 'Times New Roman',
    fontWeight: '400',
  },
  bottomTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 6,
    paddingBottom: 24,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    marginTop: 2,
  },
  activeTabText: {
    fontWeight: '500',
  },
  favoritesTab: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -10,
    top: -6,
    backgroundColor: '#ccc',
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
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

export default ProductDetailsScreen;
