import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Colors, Company } from '../config/tokens';

interface HeaderProps {
  onSearchPress?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ onSearchPress, title }) => {
  const handleWhatsApp = () => {
    Linking.openURL(Company.whatsappUrl).catch(() => {
      // fallback
    });
  };

  const handleCall = () => {
    Linking.openURL(`tel:${Company.phone}`).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandingRow}>
        <View style={styles.logoGroup}>
          {/* Orbital Sphere Symbol */}
          <View style={styles.symbolContainer}>
            <View style={styles.symbolRing} />
            <Text style={styles.symbolC}>C</Text>
            <View style={styles.symbolDot} />
          </View>
          <View style={styles.textGroup}>
            <View style={styles.wordmarkRow}>
              <Text style={styles.wordmarkCheremo}>CHEREMO</Text>
              <Text style={styles.wordmarkSphere}>SPHERE</Text>
            </View>
            <Text style={styles.sloganText}>{Company.slogan}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.callBtn} onPress={handleCall} activeOpacity={0.8}>
            <Text style={styles.callBtnText}>📞 Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.waBtn} onPress={handleWhatsApp} activeOpacity={0.8}>
            <Text style={styles.waBtnText}>💬 WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
      {title && (
        <View style={styles.titleRow}>
          <Text style={styles.pageTitle}>{title}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryNavy,
    paddingTop: Platform.OS === 'ios' ? 48 : 24,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  brandingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  symbolContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryNavyDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 122, 0, 0.4)',
    position: 'relative',
  },
  symbolRing: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.primaryOrange,
    borderTopColor: 'transparent',
    transform: [{ rotate: '-25deg' }],
  },
  symbolC: {
    color: Colors.white,
    fontWeight: '900',
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Bold' : 'sans-serif-black',
  },
  symbolDot: {
    position: 'absolute',
    top: 3,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryOrange,
  },
  textGroup: {
    justifyContent: 'center',
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordmarkCheremo: {
    color: Colors.white,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  wordmarkSphere: {
    color: Colors.primaryOrange,
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  sloganText: {
    color: '#9EAFC9',
    fontSize: 9.5,
    fontWeight: '600',
    marginTop: 1,
    letterSpacing: 0.3,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  callBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  callBtnText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  waBtn: {
    backgroundColor: '#25D366',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  waBtnText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
  titleRow: {
    marginTop: 12,
  },
  pageTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
});
