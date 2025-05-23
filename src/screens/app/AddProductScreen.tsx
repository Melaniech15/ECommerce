import React, { useState } from 'react';
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
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { ProductInput, addProduct } from '../../services/products';
import { lightTheme, darkTheme } from '../../utils/theme';

interface AddProductScreenProps {
  navigation: any;
  token: string;
}

const AddProductScreen: React.FC<AddProductScreenProps> = ({ navigation, token }) => {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? darkTheme : lightTheme;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickImages = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 0, // 0 means unlimited selection
      },
      (response) => {
        if (response.didCancel) {
          // User cancelled
          return;
        }
        if (response.errorCode) {
          Alert.alert('Error', response.errorMessage || 'Failed to pick images');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          // Append new images URIs
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

  const onSubmit = async () => {
    if (!name || !description || !price) {
      Alert.alert('Validation error', 'Please fill all required fields');
      return;
    }

    setUploading(true);

    try {
      const uploadedImages = await uploadImages();

      const product: ProductInput = {
        name,
        description,
        price: Number(price),
        images: uploadedImages,
        location: {
          latitude: 0,
          longitude: 0,
          address: ''
        }
      };

      await addProduct(token, product);

      Alert.alert('Success', 'Product added successfully');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add product');
    } finally {
      setUploading(false);
    }
  };

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

      <Button title={uploading ? 'Adding...' : 'Add Product'} onPress={onSubmit} disabled={uploading} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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

export default AddProductScreen;
