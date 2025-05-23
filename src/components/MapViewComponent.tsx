import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface MapViewComponentProps {
  latitude: number;
  longitude: number;
}

const { width } = Dimensions.get('window');

const MapViewComponent: React.FC<MapViewComponentProps> = ({ latitude, longitude }) => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: 200,
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
});

export default MapViewComponent;
