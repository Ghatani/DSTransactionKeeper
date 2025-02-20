import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const API_URL = 'https://your-api-endpoint.com/api/v1';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    handleApiError(error);
    return Promise.reject(error);
  }
);

const handleApiError = (error) => {
  if (error.response) {
    // Server responded with non-2xx status
    const status = error.response.status;
    const message = error.response.data?.message || 'Unknown error occurred';

    Toast.show({
      type: 'error',
      text1: `Server Error (${status})`,
      text2: message,
    });
  } else if (error.request) {
    // Request made but no response received
    Toast.show({
      type: 'error',
      text1: 'Network Error',
      text2: 'Please check your internet connection',
    });
  } else {
    // Something happened in setting up the request
    Toast.show({
      type: 'error',
      text1: 'Request Error',
      text2: error.message,
    });
  }
};

const TransactionService = {
  async createTransaction(transactionData) {
    try {
      const response = await api.post('/transactions', {
        ...transactionData,
        date: transactionData.date.toISOString(),
      });
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create transaction');
    }
  },

  async getTransactions(page = 1, limit = 20) {
    try {
      const response = await api.get(`/transactions?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch transactions');
    }
  },

  async getTransactionById(id) {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response;
    } catch (error) {
      throw new Error('Failed to fetch transaction details');
    }
  },

  async updateTransaction(id, updates) {
    try {
      const response = await api.put(`/transactions/${id}`, updates);
      return response;
    } catch (error) {
      throw new Error('Failed to update transaction');
    }
  },

  async deleteTransaction(id) {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response;
    } catch (error) {
      throw new Error('Failed to delete transaction');
    }
  },

  async syncLocalTransactions() {
    try {
      const localTransactions = await AsyncStorage.getItem('transactions');
      if (!localTransactions) return;

      const transactions = JSON.parse(localTransactions);
      const results = await Promise.allSettled(
        transactions.map((txn) => this.createTransaction(txn))
      );

      // Remove successfully synced transactions
      const failedTransactions = transactions.filter((_, index) => 
        results[index].status === 'rejected'
      );

      await AsyncStorage.setItem('transactions', JSON.stringify(failedTransactions));
    } catch (error) {
      console.error('Sync error:', error);
    }
  },
};

export default TransactionService;