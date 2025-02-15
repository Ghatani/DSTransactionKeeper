import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

export default function NewTransaction() {  const [formData, setFormData] = useState({
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
  }  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return '#34C759';
      case 'Partially Paid':
        return '#FF9500';
      case 'Unpaid':
        return '#FF3B30';
      default:
        return '#007AFF';
    }
  };

  const handleSubmit = () => {
    // Validate form data
    if (!formData.vehicleNo || !formData.customerName || !formData.shippingAddress || !formData.totalAmount) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      ...formData,
      transactionId: generateTransactionId(),
      vehicleNo: '',
      customerName: '',
      shippingAddress: '',
      material: '',
      quantity: '',
      paymentStatus: 'Unpaid',
      driverName: '',
      notes: '',
    });
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


const styles = StyleSheet.create({
  currencyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },  currencySymbol: {
    fontSize: 16,
    color: '#2E5CAC',
    marginLeft: 12,
    fontWeight: '600',
    minWidth: 35,
  },
  amountInput: {
    flex: 1,
    marginLeft: 4,
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EEF4',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#2E5CAC',
  },
  form: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#486581',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#334E68',
    borderWidth: 1,
    borderColor: '#E8EEF4',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  readOnlyInput: {
    backgroundColor: '#EDF2F7',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  readOnlyText: {
    fontSize: 16,
    color: '#486581',
    fontWeight: '500',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  dateText: {
    fontSize: 16,
    color: '#334E68',
    fontWeight: '500',
  },  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  picker: {
    height: 50,
    width: '100%',
    paddingHorizontal: 14,
    fontWeight: '600',
    fontSize: 16,
  },
  pickerIcon: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    zIndex: 1,
    pointerEvents: 'none',
  },
  submitButton: {
    backgroundColor: '#2E5CAC',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#2E5CAC',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});