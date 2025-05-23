import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, useColorScheme, Alert,
} from 'react-native';
import { getCart, updateCartItem, removeFromCart, clearCart } from '../../services/cart';
import { lightTheme, darkTheme } from '../../utils/theme';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartScreenProps {
  navigation: any;
  token: string;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation, token }) => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadCart = async () => {
    setLoading(true);
    try {
      const cart = await getCart(token);
      setCartItems(cart.items || []);
    } catch (e) {
      console.error('Error loading cart:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    setUpdating(itemId);
    try {
      await updateCartItem(token, itemId, newQuantity);
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (e) {
      console.error('Error updating quantity:', e);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(token, itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (e) {
      console.error('Error removing item:', e);
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearCart(token);
              setCartItems([]);
            } catch (e) {
              console.error('Error clearing cart:', e);
            }
          }
        },
      ]
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Add items to your cart before checking out.');
      return;
    }
    navigation.navigate('Checkout', { cartItems, token });
  };

  useEffect(() => {
    loadCart();
  }, []);

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Shopping Cart ({totalItems} items)
        </Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={[styles.clearButton, { color: theme.colors.primary }]}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.cartItem, { borderColor: theme.colors.border }]}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProductDetails', { productId: item.productId, token })}
                  style={styles.productInfo}
                >
                  <Text style={[styles.productName, { color: theme.colors.text }]}>{item.name}</Text>
                  <Text style={[styles.productPrice, { color: theme.colors.text }]}>
                    ${item.price.toFixed(2)} each
                  </Text>
                </TouchableOpacity>
                
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                    style={[styles.quantityButton, { borderColor: theme.colors.border }]}
                    disabled={updating === item.id}
                  >
                    <Text style={[styles.quantityButtonText, { color: theme.colors.text }]}>-</Text>
                  </TouchableOpacity>
                  
                  <Text style={[styles.quantity, { color: theme.colors.text }]}>
                    {updating === item.id ? '...' : item.quantity}
                  </Text>
                  
                  <TouchableOpacity
                    onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                    style={[styles.quantityButton, { borderColor: theme.colors.border }]}
                    disabled={updating === item.id}
                  >
                    <Text style={[styles.quantityButtonText, { color: theme.colors.text }]}>+</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.itemTotal}>
                  <Text style={[styles.itemTotalText, { color: theme.colors.text }]}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                    <Text style={[styles.removeButton, { color: theme.colors.primary }]}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: theme.colors.secondary }]}>
                  Your cart is empty
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Products')}
                  style={[styles.shopButton, { backgroundColor: theme.colors.primary }]}
                >
                  <Text style={styles.shopButtonText}>Start Shopping</Text>
                </TouchableOpacity>
              </View>
            }
          />

          {cartItems.length > 0 && (
            <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
              <View style={styles.totalContainer}>
                <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total:</Text>
                <Text style={[styles.totalAmount, { color: theme.colors.text }]}>
                  ${totalPrice.toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleCheckout}
                style={[styles.checkoutButton, { backgroundColor: theme.colors.primary }]}
              >
                <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    fontSize: 14,
    fontWeight: '500',
  },
  cartItem: {
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
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  itemTotal: {
    alignItems: 'flex-end',
  },
  itemTotalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  removeButton: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  shopButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  shopButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutButton: {
    paddingVertical: 16,
    borderRadius: 6,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;