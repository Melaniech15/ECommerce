import { createStackNavigator } from '@react-navigation/stack';
import { AppStackParamList } from './types';
import { ProductsListScreen } from '../screens/app/ProductsListScreen';
import { ProductDetailsScreen } from "../screens/app/ProductDetailsScreen";

const Stack = createStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProductsList" component={ProductsListScreen} options={{ title: 'Products' }} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </Stack.Navigator>
  );
};