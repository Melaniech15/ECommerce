import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppStackParamList } from './types';
import ProductsListScreen from '../screens/app/ProductsListScreen';
import ProductDetailsScreen from '../screens/app/ProductDetailsScreen';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext'; 
import DarkLogout from '../assets/images/dark/logout.png'; 
import LightLogout from '../assets/images/light/logout.png'; 
import DarkMode from '../assets/images/light/dark.png';
import LightMode from '../assets/images/dark/light.png'; 
import { products } from '../data/products';

const Stack = createStackNavigator<AppStackParamList>();

interface AppNavigatorProps {
  token: string;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ token }) => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth(); 

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme === 'light' ? '#fff' : '#121212',
        },
        headerTintColor: theme === 'light' ? '#000' : '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="ProductsList"
        options={{
          title: 'E-Shop',
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
              <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 16 }}>
                <Image
                  source={theme === 'dark' ? LightMode : DarkMode}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={logout}>
                <Image
                  source={theme === 'dark' ? DarkLogout : LightLogout}
                  style={{ width: 24, height: 24 }}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      >
        {props => <ProductsListScreen {...props} token={token} />}
      </Stack.Screen>
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={({ route }) => {
          const product = products.find(p => p._id === route.params.productId);
          return { title: product ? product.title : 'Product Details' };
        }}
      />
    </Stack.Navigator>
  );
};
