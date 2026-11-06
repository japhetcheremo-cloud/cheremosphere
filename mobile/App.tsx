import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Colors } from './src/config/tokens';
import { Header } from './src/components/Header';
import { HomeScreen } from './src/screens/HomeScreen';
import { JobsScreen } from './src/screens/JobsScreen';
import { AskForAJobScreen } from './src/screens/AskForAJobScreen';
import { MarketplaceScreen } from './src/screens/MarketplaceScreen';
import { FreelanceScreen } from './src/screens/FreelanceScreen';
import { NetworkScreen } from './src/screens/NetworkScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';

type TabType = 'home' | 'jobs' | 'ask-for-job' | 'market' | 'freelance' | 'network' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={(tab) => setActiveTab(tab as TabType)} />;
      case 'jobs':
        return <JobsScreen />;
      case 'ask-for-job':
        return <AskForAJobScreen />;
      case 'market':
        return <MarketplaceScreen />;
      case 'freelance':
        return <FreelanceScreen />;
      case 'network':
        return <NetworkScreen />;
      case 'profile':
        return <DashboardScreen />;
      default:
        return <HomeScreen onNavigate={(tab) => setActiveTab(tab as TabType)} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryNavy} />
      <Header />

      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('home')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, activeTab === 'home' && styles.tabIconActive]}>🏠</Text>
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('jobs')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, activeTab === 'jobs' && styles.tabIconActive]}>💼</Text>
          <Text style={[styles.tabLabel, activeTab === 'jobs' && styles.tabLabelActive]}>Jobs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('ask-for-job')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, activeTab === 'ask-for-job' && styles.tabIconActive]}>🎯</Text>
          <Text style={[styles.tabLabel, activeTab === 'ask-for-job' && styles.tabLabelActive]}>Ask Job</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('market')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, activeTab === 'market' && styles.tabIconActive]}>🛍️</Text>
          <Text style={[styles.tabLabel, activeTab === 'market' && styles.tabLabelActive]}>Market</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('freelance')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, activeTab === 'freelance' && styles.tabIconActive]}>⚡</Text>
          <Text style={[styles.tabLabel, activeTab === 'freelance' && styles.tabLabelActive]}>Services</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('network')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, activeTab === 'network' && styles.tabIconActive]}>🌐</Text>
          <Text style={[styles.tabLabel, activeTab === 'network' && styles.tabLabelActive]}>Feed</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => setActiveTab('profile')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, activeTab === 'profile' && styles.tabIconActive]}>👤</Text>
          <Text style={[styles.tabLabel, activeTab === 'profile' && styles.tabLabelActive]}>Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primaryNavy,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.lightBg,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderGrey,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabIcon: {
    fontSize: 18,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
  tabLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  tabLabelActive: {
    color: Colors.primaryOrange,
    fontWeight: '800',
  },
});
