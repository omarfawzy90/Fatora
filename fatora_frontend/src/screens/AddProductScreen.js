import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const AddProductScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { authState } = useContext(AuthContext);
  
  // Get barcode from route params if coming from scanner
  const scannedBarcode = route.params?.barcode || '';
  
  const [formData, setFormData] = useState({
    barcode: scannedBarcode,
    name: '',
    brand: '',
    price: '',
  });
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.barcode.trim()) {
      newErrors.barcode = 'Barcode is required';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add a product image',
      [
        { text: 'Cancel' },
        { 
          text: 'Camera', 
          onPress: () => {
            // TODO: Implement camera functionality
            Alert.alert('Camera', 'Camera functionality will be implemented in future updates');
          }
        },
        { 
          text: 'Gallery', 
          onPress: () => {
            // TODO: Implement gallery functionality
            Alert.alert('Gallery', 'Gallery functionality will be implemented in future updates');
          }
        },
      ]
    );
  };

  const handleScanBarcode = () => {
    navigation.navigate('Scanner');
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const productData = {
        barcode: formData.barcode,
        name: formData.name,
        brand: formData.brand,
        last_price: parseFloat(formData.price),
      };

      // If image is selected, we would add it to FormData
      // For now, we'll just send the product data
      const response = await api.post('/products', productData);
      
      Alert.alert(
        'Success',
        'Product added successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                barcode: '',
                name: '',
                brand: '',
                price: '',
              });
              setImage(null);
              navigation.goBack();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error adding product:', error);
      
      let errorMessage = 'Failed to add product. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors from backend
        const backendErrors = error.response.data.errors;
        setErrors(backendErrors);
        errorMessage = 'Please check the form for errors.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputField = (label, field, placeholder, keyboardType = 'default', multiline = false) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          multiline && styles.multilineInput,
          errors[field] && styles.inputError
        ]}
        placeholder={placeholder}
        value={formData[field]}
        onChangeText={(value) => handleInputChange(field, value)}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add New Product</Text>
          <Text style={styles.headerSubtitle}>Fill in the product details below</Text>
        </View>

        <View style={styles.form}>
          {/* Barcode Input with Scan Button */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Barcode</Text>
            <View style={styles.barcodeContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.barcodeInput,
                  errors.barcode && styles.inputError
                ]}
                placeholder="Enter or scan barcode"
                value={formData.barcode}
                onChangeText={(value) => handleInputChange('barcode', value)}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleScanBarcode}
              >
                <Text style={styles.scanButtonText}>Scan</Text>
              </TouchableOpacity>
            </View>
            {errors.barcode && <Text style={styles.errorText}>{errors.barcode}</Text>}
          </View>

          {/* Product Name */}
          {renderInputField('Product Name', 'name', 'Enter product name')}

          {/* Brand */}
          {renderInputField('Brand', 'brand', 'Enter brand name')}

          {/* Price */}
          {renderInputField('Price ($)', 'price', 'Enter price', 'numeric')}

          {/* Image Upload */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Product Image</Text>
            <TouchableOpacity
              style={styles.imageUploadContainer}
              onPress={handleImagePicker}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.uploadedImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>Tap to add image</Text>
                  <Text style={styles.imagePlaceholderSubtext}>Optional</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Add Product</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginTop: 5,
  },
  barcodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barcodeInput: {
    flex: 1,
    marginRight: 10,
  },
  scanButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  imageUploadContainer: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 5,
  },
  imagePlaceholderSubtext: {
    fontSize: 14,
    color: '#adb5bd',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  submitButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddProductScreen;