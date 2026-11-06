import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../config/tokens';
import { api, NetworkPost } from '../services/api';

export const NetworkScreen: React.FC = () => {
  const [posts, setPosts] = useState<NetworkPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const data = await api.getFeed();
      setPosts(data);
    } catch (e) {
      console.warn('Failed to load feed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert('Empty Post', 'Please write something to share with your network.');
      return;
    }
    try {
      setSubmitting(true);
      await api.createPost({
        content: newPostContent,
        post_type: 'thought',
      });
      setNewPostContent('');
      fetchFeed();
    } catch (err: any) {
      Alert.alert('Notice', err.message || 'Please sign in to publish an update.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await api.likePost(postId);
      fetchFeed();
    } catch (err) {
      // ignore
    }
  };

  return (
    <View style={styles.container}>
      {/* Create Post Card */}
      <View style={styles.createCard}>
        <Text style={styles.createHeading}>Share with CheremoSphere Network</Text>
        <TextInput
          style={styles.postInput}
          placeholder="Share an opportunity, milestone, or business advice..."
          placeholderTextColor="#94A3B8"
          multiline
          value={newPostContent}
          onChangeText={setNewPostContent}
        />
        <View style={styles.createBottom}>
          <Text style={styles.networkHint}>🌐 Visible to all members</Text>
          <TouchableOpacity
            style={[styles.publishBtn, submitting && { opacity: 0.6 }]}
            onPress={handleCreatePost}
            disabled={submitting}
          >
            <Text style={styles.publishBtnText}>{submitting ? 'Sharing...' : 'Share Update'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Feed List */}
      {loading ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={Colors.primaryOrange} />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.authorAvatar}>
                  <Text style={styles.avatarLetter}>{(item.author_name?.[0] || 'U').toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.authorName}>{item.author_name}</Text>
                  <Text style={styles.authorHeadline}>{item.author_headline || 'Professional Member'}</Text>
                </View>
              </View>

              <Text style={styles.postBody}>{item.content}</Text>

              <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleLike(item.id)}>
                  <Text style={styles.actionText}>{item.is_liked ? '❤️' : '🤍'} {item.likes_count} Likes</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionText}>💬 {item.comments_count} Comments</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightBg,
  },
  createCard: {
    backgroundColor: Colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGrey,
  },
  createHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.darkText,
    marginBottom: 8,
  },
  postInput: {
    borderWidth: 1,
    borderColor: Colors.borderGrey,
    borderRadius: 10,
    padding: 10,
    height: 70,
    textAlignVertical: 'top',
    fontSize: 13,
    color: Colors.darkText,
    backgroundColor: '#F8FAFC',
  },
  createBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  networkHint: {
    fontSize: 11,
    color: Colors.mutedText,
  },
  publishBtn: {
    backgroundColor: Colors.primaryOrange,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  publishBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 14,
    gap: 12,
  },
  postCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderGrey,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  authorAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primaryNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.darkText,
  },
  authorHeadline: {
    fontSize: 11,
    color: Colors.mutedText,
  },
  postBody: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  postActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: Colors.mutedText,
    fontWeight: '600',
  },
});
