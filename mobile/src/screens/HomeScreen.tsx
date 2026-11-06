import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Colors, Company } from '../config/tokens';
import { api, JobVacancy, JobRequest, PlatformStats } from '../services/api';

interface HomeScreenProps {
  onNavigate: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [featuredJobs, setFeaturedJobs] = useState<JobVacancy[]>([]);
  const [spotlightRequests, setSpotlightRequests] = useState<JobRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [statsData, jobsData, requestsData] = await Promise.allSettled([
        api.getStats(),
        api.getJobs(),
        api.getJobRequests(),
      ]);

      if (statsData.status === 'fulfilled') setStats(statsData.value);
      if (jobsData.status === 'fulfilled') setFeaturedJobs(jobsData.value.slice(0, 3));
      if (requestsData.status === 'fulfilled') setSpotlightRequests(requestsData.value.slice(0, 3));
    } catch (e) {
      console.warn('Error loading home data', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const openWhatsApp = () => {
    Linking.openURL(Company.whatsappUrl).catch(() => {});
  };

  const openCall = () => {
    Linking.openURL(`tel:${Company.phone}`).catch(() => {});
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primaryOrange]} />}
    >
      {/* Hero Banner */}
      <View style={styles.heroBanner}>
        <View style={styles.sloganPill}>
          <Text style={styles.sloganPillText}>JOBS • CONNECT • MARKET • GROW</Text>
        </View>
        <Text style={styles.heroHeadline}>Discover Opportunities. Connect. Grow.</Text>
        <Text style={styles.heroSub}>{Company.tagline}</Text>

        {/* Universal Search Box */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs, candidates, products, services..."
            placeholderTextColor="#8F9FB5"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Quick Action Navigation Grid */}
      <View style={styles.quickGrid}>
        <TouchableOpacity style={styles.actionCard} onPress={() => onNavigate('jobs')} activeOpacity={0.85}>
          <View style={[styles.actionIconBox, { backgroundColor: '#EBF3FE' }]}>
            <Text style={styles.actionEmoji}>💼</Text>
          </View>
          <Text style={styles.actionTitle}>Find Jobs</Text>
          <Text style={styles.actionDesc}>Vacancies in Kenya</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionCard, styles.actionCardOrange]} onPress={() => onNavigate('ask-for-job')} activeOpacity={0.85}>
          <View style={[styles.actionIconBox, { backgroundColor: '#FFF0E3' }]}>
            <Text style={styles.actionEmoji}>🎯</Text>
          </View>
          <Text style={[styles.actionTitle, { color: Colors.primaryOrange }]}>Ask for a Job</Text>
          <Text style={styles.actionDesc}>Candidates seeking work</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => onNavigate('market')} activeOpacity={0.85}>
          <View style={[styles.actionIconBox, { backgroundColor: '#F0F9FF' }]}>
            <Text style={styles.actionEmoji}>🛍️</Text>
          </View>
          <Text style={styles.actionTitle}>Marketplace</Text>
          <Text style={styles.actionDesc}>Products & Electronics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => onNavigate('freelance')} activeOpacity={0.85}>
          <View style={[styles.actionIconBox, { backgroundColor: '#F3F4F6' }]}>
            <Text style={styles.actionEmoji}>⚡</Text>
          </View>
          <Text style={styles.actionTitle}>Freelancers</Text>
          <Text style={styles.actionDesc}>Hire top talent</Text>
        </TouchableOpacity>
      </View>

      {/* Platform Live Stats */}
      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.active_vacancies || stats.total_jobs}</Text>
            <Text style={styles.statLabel}>Active Jobs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total_job_requests}</Text>
            <Text style={styles.statLabel}>Job Seekers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total_products}</Text>
            <Text style={styles.statLabel}>Products</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total_services}</Text>
            <Text style={styles.statLabel}>Services</Text>
          </View>
        </View>
      )}

      {/* Reverse Job-Seeking Spotlight ("Ask for a Job") */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>🎯 "Ask for a Job" Spotlight</Text>
          <Text style={styles.sectionSubtitle}>Direct candidate broadcasts seeking opportunities</Text>
        </View>
        <TouchableOpacity onPress={() => onNavigate('ask-for-job')}>
          <Text style={styles.seeAllText}>View All →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.horizontalScroll}>
        {spotlightRequests.map((req) => (
          <View key={req.id} style={styles.requestCard}>
            <View style={styles.requestBadge}>
              <Text style={styles.requestBadgeText}>Available for Hire</Text>
            </View>
            <Text style={styles.requestTitle} numberOfLines={1}>{req.title}</Text>
            <Text style={styles.requestCandidate}>👤 {req.user_name || 'Verified Candidate'}</Text>
            <Text style={styles.requestLocation}>📍 {req.preferred_location} • {req.employment_type}</Text>
            <View style={styles.skillsRow}>
              {req.skills?.split(',').slice(0, 3).map((sk, idx) => (
                <View key={idx} style={styles.skillPill}>
                  <Text style={styles.skillText}>{sk.trim()}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.contactCandidateBtn}
              onPress={() => Linking.openURL(`https://wa.me/${req.user_phone ? req.user_phone.replace('+', '') : '254719678760'}`)}
            >
              <Text style={styles.contactCandidateBtnText}>Connect via WhatsApp</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Featured Jobs Section */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>💼 Latest Vacancies</Text>
          <Text style={styles.sectionSubtitle}>Verified opportunities across Kenya</Text>
        </View>
        <TouchableOpacity onPress={() => onNavigate('jobs')}>
          <Text style={styles.seeAllText}>View All →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.jobsList}>
        {featuredJobs.map((job) => (
          <TouchableOpacity
            key={job.id}
            style={styles.jobCard}
            onPress={() => onNavigate('jobs')}
            activeOpacity={0.8}
          >
            <View style={styles.jobTopRow}>
              <View>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobCompany}>🏢 {job.employer_company || job.employer_name}</Text>
              </View>
              <View style={styles.jobTypeBadge}>
                <Text style={styles.jobTypeBadgeText}>{job.job_type.toUpperCase()}</Text>
              </View>
            </View>
            <View style={styles.jobMetaRow}>
              <Text style={styles.jobLocation}>📍 {job.location}</Text>
              <Text style={styles.jobSalary}>
                KES {job.salary_min ? `${job.salary_min.toLocaleString()} - ${job.salary_max?.toLocaleString()}` : 'Negotiable'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Official CheremoSphere Company Card */}
      <View style={styles.officialCard}>
        <View style={styles.officialHeader}>
          <Text style={styles.officialTitle}>Official CheremoSphere HQ</Text>
          <Text style={styles.officialOwner}>Director: {Company.owner}</Text>
        </View>
        <Text style={styles.officialText}>📍 {Company.office}</Text>
        <Text style={styles.officialText}>✉️ {Company.email}</Text>
        <Text style={styles.officialText}>📞 {Company.phone} ({Company.internationalPhone})</Text>

        <View style={styles.officialButtons}>
          <TouchableOpacity style={styles.hqCallBtn} onPress={openCall}>
            <Text style={styles.hqCallBtnText}>Call Office</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.hqWaBtn} onPress={openWhatsApp}>
            <Text style={styles.hqWaBtnText}>WhatsApp japhetcheremo</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBg,
  },
  heroBanner: {
    backgroundColor: Colors.primaryNavy,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  sloganPill: {
    backgroundColor: 'rgba(255, 122, 0, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 122, 0, 0.4)',
  },
  sloganPillText: {
    color: Colors.primaryOrange,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  heroHeadline: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 28,
  },
  heroSub: {
    fontSize: 13,
    color: '#B2C2D8',
    marginTop: 6,
    marginBottom: 18,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.darkText,
    padding: 0,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 18,
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  actionCardOrange: {
    borderColor: 'rgba(255, 122, 0, 0.3)',
    backgroundColor: '#FFFAF5',
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionEmoji: {
    fontSize: 20,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.darkText,
  },
  actionDesc: {
    fontSize: 11,
    color: Colors.mutedText,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryNavyDark,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: Colors.primaryOrange,
    fontSize: 18,
    fontWeight: '800',
  },
  statLabel: {
    color: '#8F9FB5',
    fontSize: 10.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.darkText,
  },
  sectionSubtitle: {
    fontSize: 11.5,
    color: Colors.mutedText,
    marginTop: 2,
  },
  seeAllText: {
    color: Colors.primaryOrange,
    fontSize: 13,
    fontWeight: '700',
  },
  horizontalScroll: {
    paddingHorizontal: 16,
    gap: 12,
  },
  requestCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    marginBottom: 10,
  },
  requestBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  requestBadgeText: {
    color: Colors.successGreen,
    fontSize: 10,
    fontWeight: '700',
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.darkText,
  },
  requestCandidate: {
    fontSize: 12,
    color: Colors.mutedText,
    marginTop: 4,
  },
  requestLocation: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
    marginBottom: 12,
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
  contactCandidateBtn: {
    backgroundColor: '#25D366',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactCandidateBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  jobsList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  jobCard: {
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
  },
  jobTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.darkText,
  },
  jobCompany: {
    fontSize: 12,
    color: Colors.mutedText,
    marginTop: 2,
  },
  jobTypeBadge: {
    backgroundColor: '#EEF2F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  jobTypeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryNavy,
  },
  jobMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  jobLocation: {
    fontSize: 12,
    color: '#64748B',
  },
  jobSalary: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryOrange,
  },
  officialCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
  },
  officialHeader: {
    marginBottom: 8,
  },
  officialTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primaryNavy,
  },
  officialOwner: {
    fontSize: 12,
    color: Colors.primaryOrange,
    fontWeight: '600',
    marginTop: 2,
  },
  officialText: {
    fontSize: 12,
    color: Colors.mutedText,
    marginTop: 4,
  },
  officialButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  hqCallBtn: {
    flex: 1,
    backgroundColor: Colors.primaryNavy,
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  hqCallBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  hqWaBtn: {
    flex: 1,
    backgroundColor: '#25D366',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
  },
  hqWaBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  bottomSpacer: {
    height: 30,
  },
});
