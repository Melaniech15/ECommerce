
import React from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

interface ProductSwiperProps {
  images: string[];
}

const { width } = Dimensions.get('window');

const ProductSwiper: React.FC<ProductSwiperProps> = ({ images }) => {
  if (images.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Image
          source={require('../assets/no-image.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        autoplay={true}
        autoplayTimeout={3}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      >
        {images.map((uri, index) => (
          <Image
            key={index}
            source={{ uri }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    width,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
  },
  wrapper: {},
  image: {
    width,
    height: 250,
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
});

export default ProductSwiper;
