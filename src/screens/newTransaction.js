import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/newTransactionStyles';
import TransactionService from '../utils/api'; 

const API_URL = 'https://your-api-endpoint.com/transactions';

// async function saveTransactionToBackend(transaction) {
//   try {
//     const response = await fetch(API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         ...transaction,
//         date: transaction.date.toISOString(),
//       }),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('Error saving transaction to backend:', error);
//     throw error;
//   }
// }

async function saveTransactionLocally(transaction) {
  try {
    const existingTransactions = await AsyncStorage.getItem('transactions');
    const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
    transactions.push(transaction);
    await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transaction locally:', error);
    throw error;
  }
}

const fieldLabels = {
  vehicleNo: 'Vehicle Number',
  customerName: 'Customer Name',
  shippingAddress: 'Shipping Address',
  quantity: 'Quantity',
  totalAmount: 'Total Amount',
  driverName: 'Driver Name',
};

export default function NewTransaction() {
  const [formData, setFormData] = useState({
    transactionId: generateTransactionId(),
    date: new Date(),
    vehicleNo: '',
    customerName: '',
    shippingAddress: '',
    material: '',
    quantity: '',
    paymentStatus: 'Unpaid',
    paymentReceived: '',
    totalAmount: '',
    driverName: '',
    notes: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const materials = [
    'Select Material',
    'Sand',
    'Bricks',
    'Stones',
    'Cement',
    'Gravel',
    'Steel',
  ];

  const paymentStatuses = ['Paid', 'Unpaid', 'Partially Paid'];

  function generateTransactionId() {
    return 'TXN' + Date.now().toString().slice(-6);
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const requiredFields = [
      'vehicleNo',
      'customerName',
      'shippingAddress',
      'quantity',
      'totalAmount',
      'driverName',
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);
  
    if (missingFields.length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: `Please fill in: ${missingFields.map(field => fieldLabels[field]).join(', ')}`,
      });
      setIsSubmitting(false);
      return;
    }
  
    const transactionData = {
      ...formData,
      quantity: Number(formData.quantity),
      totalAmount: Number(formData.totalAmount),
      paymentReceived: Number(formData.paymentReceived) || 0,
    };
  
    try {
      // Try to save to backend
      await TransactionService.createTransaction(transactionData);
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Transaction submitted successfully!',
      });
  
      // Reset form
      setFormData({
        ...formData,
        transactionId: generateTransactionId(),
        vehicleNo: '',
        customerName: '',
        shippingAddress: '',
        material: '',
        quantity: '',
        totalAmount: '',
        paymentReceived: '',
        paymentStatus: 'Unpaid',
        driverName: '',
        notes: '',
      });
    } catch (error) {
      // Fallback to local storage
      await saveTransactionLocally(transactionData);
      Toast.show({
        type: 'info',
        text1: 'Stored Locally',
        text2: 'Transaction saved locally and will sync when online',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, date: selectedDate });
    }
  };

  
  return (
    <ScrollView style={styles.container}>

      <View style={styles.form}>

        {/* Transaction ID */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Transaction ID</Text>
          <View style={styles.readOnlyInput}>
            <Text style={styles.readOnlyText}>{formData.transactionId}</Text>
          </View>
        </View>

        {/* Date */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity 
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>{formData.date.toLocaleDateString()}</Text>
            <MaterialIcons name="calendar-today" size={20} color="#007AFF" />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.date}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>

        {/* Vehicle Number */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Vehicle Number</Text>
          <TextInput
            style={styles.input}
            value={formData.vehicleNo}
            onChangeText={(text) => setFormData({ ...formData, vehicleNo: text })}
            placeholder="Enter vehicle number"
            autoCapitalize="characters"
          />
        </View>

        {/* Customer Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Customer Name</Text>
          <TextInput
            style={styles.input}
            value={formData.customerName}
            onChangeText={(text) => setFormData({ ...formData, customerName: text })}
            placeholder="Enter customer name"
          />
        </View>

        {/* Shipping Address */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Shipping Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.shippingAddress}
            onChangeText={(text) => setFormData({ ...formData, shippingAddress: text })}
            placeholder="Enter delivery address"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Materials */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Material</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.material}
              onValueChange={(value) => setFormData({ ...formData, material: value })}
              style={styles.picker}
            >
              {materials.map((material, index) => (
                <Picker.Item
                key={index}
                label={material}
                value={material}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Quantity */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Quantity</Text>
          <TextInput
            style={styles.input}
            value={formData.quantity}
            onChangeText={(text) => setFormData({ ...formData, quantity: text })}
            placeholder="Enter quantity"
            keyboardType="numeric"
          />
        </View>        
        
        {/* Total Amount */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Total Amount</Text>
          <View style={styles.currencyInput}>            
          <Text style={styles.currencySymbol}>Rs.</Text>
            <TextInput
              style={[styles.input, styles.amountInput]}
              value={formData.totalAmount} onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setFormData({ ...formData, totalAmount: numericValue });
              }}
              placeholder="Enter total amount"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Payment Received */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Payment Received</Text>
          <View style={styles.currencyInput}>            
          <Text style={styles.currencySymbol}>Rs.</Text>
            <TextInput
              style={[styles.input, styles.amountInput]}
              value={formData.paymentReceived} onChangeText={(text) => {
                const numericValue = text.replace(/[^0-9]/g, '');
                setFormData(prev => ({ 
                  ...prev, 
                  paymentReceived: numericValue
                }));
              }}
              placeholder="Enter received amount"
              keyboardType="numeric"
            />
          </View>
        </View>        

        {/* Payment Status */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Payment Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.paymentStatus}
              onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
              style={styles.picker}
            >
              {paymentStatuses.map((status, index) => (
                <Picker.Item
                key={index}
                label={status}
                value={status}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Driver Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Driver Name</Text>
          <TextInput
            style={styles.input}
            value={formData.driverName}
            onChangeText={(text) => setFormData({ ...formData, driverName: text })}
            placeholder="Enter driver name"
          />
        </View>

        {/* Notes */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Notes/Remarks</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text) => setFormData({ ...formData, notes: text })}
            placeholder="Enter additional notes or instructions"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Transaction</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


