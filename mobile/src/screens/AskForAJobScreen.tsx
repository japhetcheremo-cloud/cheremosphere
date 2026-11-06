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
import { api, JobRequest } from '../services/api';

export const AskForAJobScreen: React.FC = () => {
  const [requests, setRequests] = useState<JobRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [skills, setSkills] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('Nairobi');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [availability, setAvailability] = useState('Immediately');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [personalIntro, setPersonalIntro] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.getJobRequests();
      setRequests(data);
    } catch (e) {
      console.warn('Failed to fetch job requests', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handlePostRequest = async () => {
    if (!title.trim() || !personalIntro.trim()) {
      Alert.alert('Required Fields', 'Please fill in what job you are seeking and a brief introduction.');
      return;
    }
    try {
      setSubmitting(true);
      await api.createJobRequest({
        title,
        skills,
        qualifications,
        preferred_location: preferredLocation,
        employment_type: employmentType,
        availability,
        expected_salary: expectedSalary ? parseInt(expectedSalary, 10) : undefined,
        personal_introduction: personalIntro,
      });
      Alert.alert('Success! 🎉', 'Your availability broadcast has been published. Employers can now discover and contact you.');
      setShowModal(false);
      // Reset
      setTitle('');
      setSkills('');
      setPersonalIntro('');
      fetchRequests();
    } catch (err: any) {
      Alert.alert('Submission Error', err.message || 'Please log in to post your availability.');
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = requests.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.skills?.toLowerCase().includes(search.toLowerCase()) ||
    r.preferred_location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerTop}>
          <Text style={styles.bannerTitle}>🎯 "Ask for a Job" Directory</Text>
          <TouchableOpacity style={styles.createBtn} onPress={() => setShowModal(true)}>
            <Text style={styles.createBtnText}>+ Broadcast My Skills</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.bannerSub}>
          Are you seeking work? Publish your skills and availability so employers & clients can reach you directly.
        </Text>

        <TextInput
          style={styles.searchBar}
          placeholder="Filter by skill, job sought, or location (e.g. Accounting, Driver)..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Requests List */}
      {loading ? (
        <View style={styles.loaderCenter}>
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
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.candidateName}>
                    👤 {item.user_name || 'Verified Seeker'} • 📍 {item.preferred_location}
                  </Text>
                </View>
                <View style={styles.availBadge}>
                  <Text style={styles.availBadgeText}>{item.availability || 'Available'}</Text>
                </View>
              </View>

              <Text style={styles.introText}>{item.personal_introduction}</Text>

              {item.skills ? (
                <View style={styles.skillsWrapper}>
                  {item.skills.split(',').map((skill, index) => (
                    <View key={index} style={styles.skillChip}>
                      <Text style={styles.skillChipText}>{skill.trim()}</Text>
                    </View>
                  ))}
                </View>
              ) : null}

              <View style={styles.cardFooter}>
                <View>
                  <Text style={styles.salaryLabel}>Expected Salary</Text>
                  <Text style={styles.salaryValue}>
                    {item.expected_salary ? `KES ${item.expected_salary.toLocaleString()}/mo` : 'Negotiable'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.contactBtn}
                  onPress={() => {
                    const phone = item.user_phone ? item.user_phone.replace('+', '') : '254719678760';
                    Linking.openURL(`https://wa.me/${phone}?text=Hello%2C+I+found+your+profile+on+CheremoSphere+seeking+${encodeURIComponent(item.title)}`);
                  }}
                >
                  <Text style={styles.contactBtnText}>💬 Contact Candidate</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Post Availability Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Broadcast Your Availability</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Job Sought / Role Title *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Certified Accountant, Trained Driver, Graphic Designer"
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.inputLabel}>Skills (comma separated) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. QuickBooks, Tax Filing, Financial Modeling"
                value={skills}
                onChangeText={setSkills}
              />

              <Text style={styles.inputLabel}>Qualifications</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. B.Com Accounting, CPA-K Certified"
                value={qualifications}
                onChangeText={setQualifications}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Preferred Location</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. Nairobi, Bungoma"
                    value={preferredLocation}
                    onChangeText={setPreferredLocation}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Expected Salary (KES)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 50000"
                    keyboardType="numeric"
                    value={expectedSalary}
                    onChangeText={setExpectedSalary}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Personal Introduction / Pitch *</Text>
              <TextInput
                style={[styles.textInput, { height: 90, textAlignVertical: 'top' }]}
                multiline
                placeholder="Describe your background, years of experience, and why an employer should hire you..."
                value={personalIntro}
                onChangeText={setPersonalIntro}
              />

              <TouchableOpacity
                style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
                onPress={handlePostRequest}
                disabled={submitting}
              >
                <Text style={styles.submitBtnText}>
                  {submitting ? 'Publishing...' : '🚀 Publish Availability Broadcast'}
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
  bannerSub: {
    fontSize: 12,
    color: '#B0C2DB',
    marginTop: 6,
    lineHeight: 17,
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
  listContent: {
    padding: 16,
    gap: 12,
  },
  loaderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.darkText,
  },
  candidateName: {
    fontSize: 12,
    color: Colors.mutedText,
    marginTop: 3,
  },
  availBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  availBadgeText: {
    color: Colors.successGreen,
    fontSize: 10,
    fontWeight: '700',
  },
  introText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginTop: 10,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  skillChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  skillChipText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  salaryLabel: {
    fontSize: 10.5,
    color: Colors.mutedText,
  },
  salaryValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primaryOrange,
  },
  contactBtn: {
    backgroundColor: '#25D366',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  contactBtnText: {
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
    marginBottom: 16,
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
  submitBtn: {
    backgroundColor: Colors.primaryOrange,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 30,
  },
  submitBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
