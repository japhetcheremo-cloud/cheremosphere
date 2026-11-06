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
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../config/tokens';
import { api, JobVacancy } from '../services/api';

export const JobsScreen: React.FC = () => {
  const [jobs, setJobs] = useState<JobVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobVacancy | null>(null);

  // Apply modal
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);

  // Post Job modal
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newLocation, setNewLocation] = useState('Nairobi');
  const [newJobType, setNewJobType] = useState('full_time');
  const [newMinSalary, setNewMinSalary] = useState('');
  const [newMaxSalary, setNewMaxSalary] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await api.getJobs();
      setJobs(data);
    } catch (e) {
      console.warn('Failed to load jobs', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async () => {
    if (!selectedJob) return;
    try {
      setApplying(true);
      await api.applyJob({
        job_id: selectedJob.id,
        cover_letter: coverLetter,
      });
      Alert.alert('Application Sent! ✅', `Your application for ${selectedJob.title} has been submitted.`);
      setApplyModalVisible(false);
      setCoverLetter('');
    } catch (err: any) {
      Alert.alert('Application Notice', err.message || 'Please log in as a job seeker to apply.');
    } finally {
      setApplying(false);
    }
  };

  const handleCreateJob = async () => {
    if (!newTitle.trim() || !newDesc.trim()) {
      Alert.alert('Required', 'Please fill in job title and description.');
      return;
    }
    try {
      setCreating(true);
      await api.createJob({
        title: newTitle,
        category: 1,
        job_type: newJobType,
        location: newLocation,
        salary_min: newMinSalary ? parseInt(newMinSalary, 10) : undefined,
        salary_max: newMaxSalary ? parseInt(newMaxSalary, 10) : undefined,
        description: newDesc,
      });
      Alert.alert('Success!', 'Job vacancy published successfully.');
      setPostModalVisible(false);
      setNewTitle('');
      setNewDesc('');
      fetchJobs();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Please log in as an employer to post vacancies.');
    } finally {
      setCreating(false);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase()) ||
      (j.employer_company && j.employer_company.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      {/* Top Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerTop}>
          <Text style={styles.bannerTitle}>💼 Job Vacancies in Kenya</Text>
          <TouchableOpacity style={styles.postJobBtn} onPress={() => setPostModalVisible(true)}>
            <Text style={styles.postJobBtnText}>+ Post Vacancy</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchBar}
          placeholder="Search jobs by title, company, or city..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Jobs List */}
      {loading ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={Colors.primaryOrange} />
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelectedJob(item)}
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.companyName}>🏢 {item.employer_company || item.employer_name}</Text>
                </View>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{(item.job_type || 'Full-time').toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.descSnippet} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.cardFooter}>
                <Text style={styles.locationText}>📍 {item.location} {item.is_remote ? '• Remote' : ''}</Text>
                <Text style={styles.salaryText}>
                  KES {item.salary_min ? `${item.salary_min.toLocaleString()} - ${item.salary_max?.toLocaleString()}` : 'Negotiable'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Job Details Modal */}
      <Modal visible={!!selectedJob} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailTitle}>{selectedJob?.title}</Text>
                <Text style={styles.detailCompany}>🏢 {selectedJob?.employer_company || selectedJob?.employer_name}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedJob(null)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.detailMetaBox}>
                <Text style={styles.detailMetaItem}>📍 Location: {selectedJob?.location}</Text>
                <Text style={styles.detailMetaItem}>💼 Type: {selectedJob?.job_type}</Text>
                <Text style={styles.detailMetaItem}>
                  💰 Salary: KES {selectedJob?.salary_min ? `${selectedJob?.salary_min.toLocaleString()} - ${selectedJob?.salary_max?.toLocaleString()}` : 'Negotiable'}
                </Text>
                {selectedJob?.deadline && (
                  <Text style={styles.detailMetaItem}>⏰ Deadline: {selectedJob.deadline}</Text>
                )}
              </View>

              <Text style={styles.subHeading}>Job Description</Text>
              <Text style={styles.detailText}>{selectedJob?.description}</Text>

              {selectedJob?.requirements ? (
                <>
                  <Text style={styles.subHeading}>Requirements & Qualifications</Text>
                  <Text style={styles.detailText}>{selectedJob?.requirements}</Text>
                </>
              ) : null}

              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => {
                  setApplyModalVisible(true);
                }}
              >
                <Text style={styles.applyBtnText}>Apply for this Position</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Submit Application Modal */}
      <Modal visible={applyModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '60%' }]}>
            <Text style={styles.modalTitle}>Apply for {selectedJob?.title}</Text>
            <Text style={styles.inputLabel}>Cover Note / Pitch *</Text>
            <TextInput
              style={[styles.textInput, { height: 100, textAlignVertical: 'top' }]}
              multiline
              placeholder="State why you are qualified for this position..."
              value={coverLetter}
              onChangeText={setCoverLetter}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.cancelBtn, { flex: 1 }]}
                onPress={() => setApplyModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.applyBtn, { flex: 1, marginTop: 0 }]}
                onPress={handleApply}
                disabled={applying}
              >
                <Text style={styles.applyBtnText}>{applying ? 'Submitting...' : 'Confirm Application'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Post Vacancy Modal */}
      <Modal visible={postModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Post a Job Vacancy</Text>
              <TouchableOpacity onPress={() => setPostModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Job Title *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Senior Frontend Developer"
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Nairobi, Mombasa Road"
                value={newLocation}
                onChangeText={setNewLocation}
              />

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Min Salary (KES)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 80000"
                    keyboardType="numeric"
                    value={newMinSalary}
                    onChangeText={setNewMinSalary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Max Salary (KES)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 150000"
                    keyboardType="numeric"
                    value={newMaxSalary}
                    onChangeText={setNewMaxSalary}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Detailed Job Description *</Text>
              <TextInput
                style={[styles.textInput, { height: 90, textAlignVertical: 'top' }]}
                multiline
                placeholder="Roles, expectations, qualifications..."
                value={newDesc}
                onChangeText={setNewDesc}
              />

              <TouchableOpacity
                style={[styles.applyBtn, creating && { opacity: 0.6 }]}
                onPress={handleCreateJob}
                disabled={creating}
              >
                <Text style={styles.applyBtnText}>{creating ? 'Publishing...' : '🚀 Publish Vacancy'}</Text>
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
  postJobBtn: {
    backgroundColor: Colors.primaryOrange,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  postJobBtnText: {
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.darkText,
  },
  companyName: {
    fontSize: 12,
    color: Colors.mutedText,
    marginTop: 2,
  },
  typeBadge: {
    backgroundColor: '#EEF2F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryNavy,
  },
  descSnippet: {
    fontSize: 12.5,
    color: '#475569',
    marginTop: 8,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
  },
  salaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryOrange,
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
    maxHeight: '88%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryNavy,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryNavy,
  },
  detailCompany: {
    fontSize: 13,
    color: Colors.primaryOrange,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    fontSize: 20,
    color: Colors.mutedText,
    padding: 4,
  },
  modalBody: {
    marginBottom: 20,
  },
  detailMetaBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    gap: 4,
  },
  detailMetaItem: {
    fontSize: 12.5,
    color: Colors.darkText,
    fontWeight: '500',
  },
  subHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.darkText,
    marginTop: 12,
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  applyBtn: {
    backgroundColor: Colors.primaryOrange,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  applyBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  cancelBtn: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: Colors.darkText,
    fontSize: 13,
    fontWeight: '600',
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
});
