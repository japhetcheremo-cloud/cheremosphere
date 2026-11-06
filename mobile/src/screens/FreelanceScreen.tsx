import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../config/tokens';
import { api, FreelanceService } from '../services/api';

export const FreelanceScreen: React.FC = () => {
  const [services, setServices] = useState<FreelanceService[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [createModal, setCreateModal] = useState(false);

  // Create Service Form
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [pricingType, setPricingType] = useState('fixed');
  const [deliveryDays, setDeliveryDays] = useState('3');
  const [skills, setSkills] = useState('');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await api.getServices();
      setServices(data);
    } catch (e) {
      console.warn('Failed to load services', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreateService = async () => {
    if (!title.trim() || !price.trim() || !desc.trim()) {
      Alert.alert('Required', 'Please fill in service title, starting price, and description.');
      return;
    }
    try {
      setSubmitting(true);
      await api.createService({
        title,
        category: 1,
        starting_price: parseInt(price, 10),
        pricing_type: pricingType,
        delivery_time_days: parseInt(deliveryDays, 10) || 3,
        skills,
        description: desc,
      });
      Alert.alert('Success! ⚡', 'Your freelance service is now listed.');
      setCreateModal(false);
      setTitle('');
      setPrice('');
      setDesc('');
      fetchServices();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Please log in as a freelancer to list services.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.provider_name?.toLowerCase().includes(search.toLowerCase()) ||
      s.skills?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <View style={styles.bannerTop}>
          <Text style={styles.bannerTitle}>⚡ Freelance & Pro Services</Text>
          <TouchableOpacity style={styles.createBtn} onPress={() => setCreateModal(true)}>
            <Text style={styles.createBtnText}>+ Offer Service</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search graphic design, web dev, plumber, writer..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={Colors.primaryOrange} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.serviceTitle}>{item.title}</Text>
                  <Text style={styles.providerName}>👤 {item.provider_name}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>★ {item.rating || '5.0'}</Text>
                </View>
              </View>

              <Text style={styles.serviceDesc}>{item.description}</Text>

              {item.skills ? (
                <View style={styles.skillsRow}>
                  {item.skills.split(',').map((sk, idx) => (
                    <View key={idx} style={styles.skillPill}>
                      <Text style={styles.skillText}>{sk.trim()}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.priceLabel}>Starting from</Text>
                  <Text style={styles.priceValue}>
                    KES {item.starting_price.toLocaleString()}{' '}
                    <Text style={styles.priceType}>/{item.pricing_type || 'project'}</Text>
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.hireBtn}
                  onPress={() =>
                    Linking.openURL(
                      `https://wa.me/254719678760?text=Hello+${encodeURIComponent(
                        item.provider_name
                      )}%2C+I+found+your+service+${encodeURIComponent(item.title)}+on+CheremoSphere`
                    )
                  }
                >
                  <Text style={styles.hireBtnText}>💬 Hire Freelancer</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Offer Service Modal */}
      <Modal visible={createModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Advertise Freelance Service</Text>
              <TouchableOpacity onPress={() => setCreateModal(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Service Title *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Modern Mobile & Web App Development"
                value={title}
                onChangeText={setTitle}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Starting Price (KES) *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 15000"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Delivery Time (Days)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 5"
                    keyboardType="numeric"
                    value={deliveryDays}
                    onChangeText={setDeliveryDays}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Skills / Tools (comma separated)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. React Native, Python, Django, Figma"
                value={skills}
                onChangeText={setSkills}
              />

              <Text style={styles.inputLabel}>Service Description & Scope *</Text>
              <TextInput
                style={[styles.textInput, { height: 90, textAlignVertical: 'top' }]}
                multiline
                placeholder="Describe deliverables, revisions, and expertise..."
                value={desc}
                onChangeText={setDesc}
              />

              <TouchableOpacity
                style={[styles.publishBtn, submitting && { opacity: 0.6 }]}
                onPress={handleCreateService}
                disabled={submitting}
              >
                <Text style={styles.publishBtnText}>
                  {submitting ? 'Publishing...' : '🚀 Publish Service'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBg,
  },
  banner: {
    backgroundColor: Colors.primaryNavy,
    padding: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  bannerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.white,
  },
  createBtn: {
    backgroundColor: Colors.primaryOrange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  createBtnText: {
    color: Colors.white,
    fontSize: 11.5,
    fontWeight: '700',
  },
  searchBar: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    fontSize: 13,
    color: Colors.darkText,
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.darkText,
  },
  providerName: {
    fontSize: 12,
    color: Colors.mutedText,
    marginTop: 2,
  },
  ratingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '700',
  },
  serviceDesc: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginTop: 8,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  skillPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  skillText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceLabel: {
    fontSize: 10.5,
    color: Colors.mutedText,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryOrange,
  },
  priceType: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.mutedText,
  },
  hireBtn: {
    backgroundColor: '#25D366',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  hireBtnText: {
    color: Colors.white,
    fontSize: 11.5,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryNavy,
  },
  closeBtn: {
    fontSize: 20,
    color: Colors.mutedText,
    padding: 4,
  },
  modalBody: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.darkText,
    marginTop: 10,
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.darkText,
    backgroundColor: '#F8FAFC',
  },
  publishBtn: {
    backgroundColor: Colors.primaryOrange,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 24,
  },
  publishBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
