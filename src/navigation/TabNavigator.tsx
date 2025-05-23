import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { darkTheme, lightTheme } from '../utils/theme';


import ProductsListScreen from '../screens/app/ProductsListScreen';
import FavoritesScreen from '../screens/app/FavoritesScreen';
import CartScreen from '../screens/app/CartScreen';
import ProfileScreen from '../screens/app/ProfileScreen';

import LightHome from '../assets/images/light/home.png';
import LightBrowser from '../assets/images/light/browse.png';
import LightFavourites from '../assets/images/light/favourites.png';
import LightCart from '../assets/images/light/cart.png';
import LightProfile from '../assets/images/light/profile.png';

import DarkHome from '../assets/images/dark/home.png';
import DarkBrowse from '../assets/images/dark/browse.png';
import DarkFavourites from '../assets/images/dark/favourites.png';
import DarkCart from '../assets/images/dark/cart.png';
import DarkProfile from '../assets/images/dark/profile.png';

export type TabParamList = {
  Home: undefined;
  Browse: undefined;
  Favorites: undefined;
  Cart: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

interface TabNavigatorProps {
  token: string;
  onLogout: () => void;
}

const TabNavigator: React.FC<TabNavigatorProps> = ({ token, onLogout }) => {
  const { theme } = useTheme();
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  const getTabIcon = (routeName: string, focused: boolean) => {
    let iconSource;

    switch (routeName) {
      case 'Home':
        iconSource = theme === 'dark' ? DarkHome : LightHome;
        break;
      case 'Browse':
        iconSource = theme === 'dark' ? DarkBrowse : LightBrowser;
        break;
      case 'Favorites':
        iconSource = theme === 'dark' ? DarkFavourites : LightFavourites;
        break;
      case 'Cart':
        iconSource = theme === 'dark' ? DarkCart : LightCart;
        break;
      case 'Profile':
        iconSource = theme === 'dark' ? DarkProfile : LightProfile;
        break;
      default:
        iconSource = theme === 'dark' ? DarkHome : LightHome;
    }

    return (
      <View style={{ alignItems: 'center' }}>
        <Image
          source={iconSource}
          style={{
            width: 24,
            height: 24,
            opacity: focused ? 1 : 0.6
          }}
        />
        {routeName === 'Favorites' && (
          <View style={{
            position: 'absolute',
            top: -5,
            right: -8,
            backgroundColor: '#888',
            borderRadius: 10,
            width: 16,
            height: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{
              color: '#fff',
              fontSize: 10,
              fontWeight: '700',
            }}>6</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => getTabIcon(route.name, focused),
        tabBarActiveTintColor: currentTheme.colors.text,
        tabBarInactiveTintColor: currentTheme.colors.text,
        tabBarStyle: {
          backgroundColor: currentTheme.colors.card,
          borderTopColor: currentTheme.colors.border,
          borderTopWidth: 1,
          paddingBottom: 20,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 4,
        },
        headerStyle: {
          backgroundColor: currentTheme.colors.background,
        },
        headerTintColor: currentTheme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen
        name="Browse"
        options={{ title: 'Browse' }}
      >
        {props => <ProductsListScreen {...props} token={token} />}
      </Tab.Screen>
      <Tab.Screen
        name="Favorites"
        options={{ title: 'Favorites' }}
      >
        {props => <FavoritesScreen {...props} token={token} />}
      </Tab.Screen>
      <Tab.Screen
        name="Cart"
        options={{ title: 'Cart' }}
      >
        {props => <CartScreen {...props} token={token} />}
      </Tab.Screen>
      <Tab.Screen
        name="Profile"
        options={{ title: 'Profile' }}
      >
        {props => <ProfileScreen {...props} token={token} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TabNavigator;