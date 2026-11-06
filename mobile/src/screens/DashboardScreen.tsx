import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Colors, Company } from '../config/tokens';
import { api, setAuthToken, User } from '../services/api';

export const DashboardScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Auth form
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [activeRole, setActiveRole] = useState<'seeker' | 'employer' | 'seller' | 'freelancer'>('seeker');

  const checkCurrentUser = async () => {
    try {
      setLoading(true);
      const profile = await api.getProfile();
      setUser(profile);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const handleLogin = async (uname?: string, pwd?: string) => {
    const u = uname || username;
    const p = pwd || password;
    if (!u || !p) {
      Alert.alert('Required', 'Please enter username and password');
      return;
    }
    try {
      setLoading(true);
      const res = await api.login({ username: u, password: p });
      setAuthToken(res.token);
      setUser(res.user);
      Alert.alert('Welcome Back! 👋', `Logged in as ${res.user.first_name || res.user.username}`);
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!username || !password || !email) {
      Alert.alert('Required', 'Please fill in username, email, and password');
      return;
    }
    try {
      setLoading(true);
      const res = await api.register({
        username,
        email,
        password,
        phone_number: phone,
        is_job_seeker: activeRole === 'seeker',
        is_employer: activeRole === 'employer',
        is_freelancer: activeRole === 'freelancer',
        is_seller: activeRole === 'seller',
      });
      setAuthToken(res.token);
      setUser(res.user);
      Alert.alert('Account Created! 🚀', `Welcome to CheremoSphere, ${res.user.username}`);
    } catch (err: any) {
      Alert.alert('Registration Error', err.message || 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    Alert.alert('Logged Out', 'You have been signed out.');
  };

  return (
    <ScrollView style={styles.container}>
      {/* User Header / Login status */}
      {user ? (
        <View style={styles.userCard}>
          <View style={styles.userTop}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {(user.first_name?.[0] || user.username[0]).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user.first_name ? `${user.first_name} ${user.last_name}` : user.username}</Text>
              <Text style={styles.userHandle}>@{user.username} • {user.phone_number || 'No phone'}</Text>
              <View style={styles.rolesRow}>
                {user.is_job_seeker && <Text style={styles.roleBadge}>Seeker</Text>}
                {user.is_employer && <Text style={styles.roleBadge}>Employer</Text>}
                {user.is_freelancer && <Text style={styles.roleBadge}>Freelancer</Text>}
                {user.is_seller && <Text style={styles.roleBadge}>Seller</Text>}
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.authBox}>
          <Text style={styles.authHeading}>{isRegister ? 'Create CheremoSphere Account' : 'Sign in to CheremoSphere'}</Text>
          <Text style={styles.authSub}>Access your unified multi-role workspace</Text>

          {/* Quick Demo Login Buttons */}
          <View style={styles.demoBox}>
            <Text style={styles.demoTitle}>⚡ Quick 1-Tap Demo Logins:</Text>
            <View style={styles.demoGrid}>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => handleLogin('safari_tech', 'Password123!')}
              >
                <Text style={styles.demoBtnText}>🏢 Employer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => handleLogin('kevin_dev', 'Password123!')}
              >
                <Text style={styles.demoBtnText}>⚡ Freelancer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => handleLogin('mama_mboga_direct', 'Password123!')}
              >
                <Text style={styles.demoBtnText}>🛍️ Seller</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoBtn}
                onPress={() => handleLogin('admin', 'AdminPassword2026!')}
              >
                <Text style={styles.demoBtnText}>🛡️ Admin</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or enter credentials</Text>
            <View style={styles.orLine} />
          </View>

          <Text style={styles.inputLabel}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          {isRegister && (
            <>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Text style={styles.inputLabel}>Phone / WhatsApp</Text>
              <TextInput
                style={styles.input}
                placeholder="0712345678"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </>
          )}

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.primaryAuthBtn}
            onPress={() => (isRegister ? handleRegister() : handleLogin())}
            disabled={loading}
          >
            <Text style={styles.primaryAuthBtnText}>
              {loading ? 'Please wait...' : isRegister ? 'Register Account' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleAuthBtn}
            onPress={() => setIsRegister(!isRegister)}
          >
            <Text style={styles.toggleAuthText}>
              {isRegister
                ? 'Already have an account? Sign in'
                : "Don't have an account? Create one"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Official CheremoSphere Company Information */}
      <View style={styles.companySection}>
        <Text style={styles.companySectionTitle}>Official Company Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Company:</Text>
          <Text style={styles.infoValue}>{Company.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Founder / Owner:</Text>
          <Text style={styles.infoValue}>{Company.owner}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Office Location:</Text>
          <Text style={styles.infoValue}>{Company.office}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>WhatsApp / Phone:</Text>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${Company.phone}`)}>
            <Text style={[styles.infoValue, { color: Colors.primaryOrange, fontWeight: '700' }]}>
              {Company.phone} ({Company.internationalPhone})
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Official Email:</Text>
          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${Company.email}`)}>
            <Text style={[styles.infoValue, { color: Colors.primaryNavy, fontWeight: '700' }]}>
              {Company.email}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialButtons}>
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=61564247063691')}
          >
            <Text style={styles.socialBtnText}>Facebook Page</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() => Linking.openURL('https://github.com/japhetcheremo-cloud')}
          >
            <Text style={styles.socialBtnText}>GitHub Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBg,
    padding: 16,
  },
  userCard: {
    backgroundColor: Colors.white,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    marginBottom: 20,
  },
  userTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '800',
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.darkText,
  },
  userHandle: {
    fontSize: 12,
    color: Colors.mutedText,
    marginTop: 2,
  },
  rolesRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  roleBadge: {
    backgroundColor: '#EFF6FF',
    color: Colors.primaryNavy,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  logoutBtn: {
    marginTop: 16,
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutBtnText: {
    color: Colors.errorRed,
    fontSize: 12,
    fontWeight: '700',
  },
  authBox: {
    backgroundColor: Colors.white,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    marginBottom: 20,
  },
  authHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryNavy,
  },
  authSub: {
    fontSize: 12,
    color: Colors.mutedText,
    marginTop: 2,
    marginBottom: 16,
  },
  demoBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.darkText,
    marginBottom: 8,
  },
  demoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  demoBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  demoBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.darkText,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderGrey,
  },
  orText: {
    marginHorizontal: 8,
    fontSize: 11,
    color: Colors.mutedText,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.darkText,
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.darkText,
    backgroundColor: '#F8FAFC',
  },
  primaryAuthBtn: {
    backgroundColor: Colors.primaryOrange,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryAuthBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  toggleAuthBtn: {
    marginTop: 12,
    alignItems: 'center',
  },
  toggleAuthText: {
    color: Colors.primaryNavy,
    fontSize: 12,
    fontWeight: '600',
  },
  companySection: {
    backgroundColor: Colors.white,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
  },
  companySectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryNavy,
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.mutedText,
  },
  infoValue: {
    fontSize: 13,
    color: Colors.darkText,
    fontWeight: '500',
    marginTop: 1,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  socialBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  socialBtnText: {
    fontSize: 11.5,
    color: Colors.primaryNavy,
    fontWeight: '700',
  },
});
