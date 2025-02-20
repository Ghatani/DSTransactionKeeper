import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../styles/dashboardStyles';

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

