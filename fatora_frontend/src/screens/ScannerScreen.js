import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
 
import api from '../services/api.js';

const ScannerScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false); 

  const onBarCodeRead = async (scanResult) => {
    if (isLoading) return;

    const barcode = scanResult.data;
    console.log('Scanned Barcode:', barcode);
    setIsLoading(true);

    try {
      const response = await api.get(`/products/${barcode}`);
      const product = response.data.product;

      Alert.alert('Product Found!', `${product.name} - ${product.last_price} EGP`);

    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert(
          'Product Not Found',
          `Barcode ${barcode} is not in our database. Would you like to add it?`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setIsLoading(false) },
            { text: 'Add Product', onPress: () => {
                navigation.navigate('AddProduct', { barcode });
                setIsLoading(false);
            }},
          ]
        );
      } else {
        console.error('API Error:', error);
        Alert.alert('Error', 'Could not fetch product details.');
        setIsLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        onBarCodeRead={onBarCodeRead}
        captureAudio={false}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
              {isLoading && <Text style={styles.loadingText}>Searching...</Text>}
          </View>
        </View>
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 300,
    height: 150,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
});

export default ScannerScreen;