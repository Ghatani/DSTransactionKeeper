import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function DashboardScreen({ navigation }) {
  const [selectedPeriod, setSelectedPeriod] = useState('daily');

  const quickActions = [
    {
      id: 1,
      title: 'New Transaction',
      icon: <MaterialCommunityIcons name="cash-plus" size={24} color="#FFF" />,
      gradient: ['#FF6B6B', '#FF8E8E'],
      onPress: () => navigation.navigate('NewTransaction'),
    },
    {
      id: 2,
      title: 'Transactions',
      icon: <MaterialCommunityIcons name="receipt" size={24} color="#FFF" />,
      gradient: ['#4FACFE', '#00F2FE'],
    },
    {
      id: 3,
      title: 'Materials',
      icon: <MaterialCommunityIcons name="package-variant" size={24} color="#FFF" />,
      gradient: ['#43E97B', '#38F9D7'],
    },
    {
      id: 4,
      title: 'Customers',
      icon: <Ionicons name="people" size={24} color="#FFF" />,
      gradient: ['#FA709A', '#FEE140'],
    },
    {
      id: 5,
      title: 'Drivers',
      icon: <Ionicons name="car" size={24} color="#FFF" />,
      gradient: ['#6157FF', '#EE49FD'],
    },
    {
      id: 6,
      title: 'Vehicles',
      icon: <FontAwesome5 name="truck" size={24} color="#FFF" />,
      gradient: ['#08AEEA', '#2AF598'],
    },
  ];  const reportingData = {
    daily: {
      total: '₹45,250',
      totalTransactions: 28,
      paidTransactions: 22,
      unpaidTransactions: 6,
      growth: '+12.5%'
    },
    weekly: {
      total: '₹285,750',
      totalTransactions: 145,
      paidTransactions: 128,
      unpaidTransactions: 17,
      growth: '+8.3%'
    },
    monthly: {
      total: '₹1,250,000',
      totalTransactions: 580,
      paidTransactions: 512,
      unpaidTransactions: 68,
      growth: '+15.2%'
    }
  };  const renderMetrics = () => (
    <View style={styles.metricsContainer}>
      <View style={styles.metricRow}>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{reportingData[selectedPeriod].total}</Text>
          <Text style={styles.metricLabel}>Total Revenue</Text>
          <Text style={[styles.growthText, { color: '#2ECC71' }]}>
            {reportingData[selectedPeriod].growth}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricValue}>{reportingData[selectedPeriod].totalTransactions}</Text>
          <Text style={styles.metricLabel}>Total Transactions</Text>
        </View>
      </View>
      <View style={styles.metricRow}>
        <View style={[styles.metric, styles.paidMetric]}>
          <Text style={styles.metricValue}>{reportingData[selectedPeriod].paidTransactions}</Text>
          <Text style={styles.metricLabel}>Paid</Text>
        </View>
        <View style={[styles.metric, styles.unpaidMetric]}>
          <Text style={styles.metricValue}>{reportingData[selectedPeriod].unpaidTransactions}</Text>
          <Text style={styles.metricLabel}>Unpaid</Text>
        </View>
      </View>
    </View>
  );

  const renderQuickAction = (action) => (
    <TouchableOpacity key={action.id} style={styles.actionButton} onPress={action.onPress} >
      <LinearGradient
        colors={action.gradient}
        style={styles.actionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {action.icon}
        <Text style={styles.actionText}>{action.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'daily' && styles.periodButtonActive]}
        onPress={() => setSelectedPeriod('daily')}
      >
        <Text style={[styles.periodButtonText, selectedPeriod === 'daily' && styles.periodButtonTextActive]}>
          Daily
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'weekly' && styles.periodButtonActive]}
        onPress={() => setSelectedPeriod('weekly')}
      >
        <Text style={[styles.periodButtonText, selectedPeriod === 'weekly' && styles.periodButtonTextActive]}>
          Weekly
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'monthly' && styles.periodButtonActive]}
        onPress={() => setSelectedPeriod('monthly')}
      >
        <Text style={[styles.periodButtonText, selectedPeriod === 'monthly' && styles.periodButtonTextActive]}>
          Monthly
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.businessName}>Dolakha Suppliers</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {renderPeriodSelector()}
      {renderMetrics()}

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {quickActions.map(renderQuickAction)}
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    right: 6,
    top: 6,
    backgroundColor: '#FF4444',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  periodButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  periodButtonTextActive: {
    color: '#FFF',
  },  metricsContainer: {
    padding: 20,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metric: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  paidMetric: {
    borderLeftWidth: 4,
    borderLeftColor: '#2ECC71',
  },
  unpaidMetric: {
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
  },
  growthText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 5,
  },
  breakdownContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#666',
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 60) / 2,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  actionText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },
});