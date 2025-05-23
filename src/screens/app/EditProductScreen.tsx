import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
  useColorScheme,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { fetchProductById, updateProduct, Product } from  '../../services/products';
import { lightTheme, darkTheme } from '../../utils/theme';

interface EditProductScreenProps {
  navigation: any;
  route: { params: { productId: string; token: string } };
}

const EditProductScreen: React.FC<EditProductScreenProps> = ({ navigation, route }) => {
  const { productId, token } = route.params;
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProductById(productId);
        setProduct(data);
        setName(data.name);
        setDescription(data.description);
        setPrice(data.price.toString());
        setImages((data.images || []).map((img: any) => typeof img === 'string' ? img : img.url));
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to load product');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [productId, token]);

  const pickImages = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0,
      },
      (response) => {
        if (response.didCancel) {
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to pick images');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setImages((prev) => [
            ...prev,
            ...(response.assets ?? [])
              .map((asset) => asset.uri)
              .filter((uri): uri is string => !!uri),
          ]);
        }
      }
    );
  };

  const uploadImages = async (): Promise<string[]> => {
    // Replace with real upload logic; here just return local URIs
    return images;
  };

  const onSave = async () => {
    if (!name || !description || !price) {
      Alert.alert('Validation error', 'Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      const uploadedImages = await uploadImages();

      const updatedProduct = {
        name,
        description,
        price: Number(price),
        images: uploadedImages,
      };

      await updateProduct(productId, updatedProduct);
      Alert.alert('Success', 'Product updated successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Loading product...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.label, { color: theme.colors.text }]}>Name *</Text>
      <TextInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
        placeholder="Product name"
        placeholderTextColor={theme.colors.placeholder}
        value={name}
        onChangeText={setName}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Description *</Text>
      <TextInput
        style={[styles.textArea, { color: theme.colors.text, borderColor: theme.colors.border }]}
        placeholder="Product description"
        placeholderTextColor={theme.colors.placeholder}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Price *</Text>
      <TextInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
        placeholder="Price in USD"
        placeholderTextColor={theme.colors.placeholder}
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Images</Text>
      <View style={styles.imagePreviewContainer}>
        {images.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.imagePreview} />
        ))}
      </View>
      <TouchableOpacity onPress={pickImages} style={[styles.button, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.buttonText}>Pick Images</Text>
      </TouchableOpacity>

      <Button title={saving ? 'Saving...' : 'Save Changes'} onPress={onSave} disabled={saving} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    height: 100,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  imagePreview: {
    width: 70,
    height: 70,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default EditProductScreen;
