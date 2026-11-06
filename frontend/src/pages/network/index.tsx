import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { 
  Users, Heart, MessageCircle, Share2, Send, 
  Sparkles, UserCheck, Briefcase, Plus, CheckCircle2 
} from 'lucide-react';
import Layout from '@/components/Layout';
import { apiFetch, getToken, getStoredUser, NetworkPost, User } from '@/lib/api';

export default function NetworkPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<NetworkPost[]>([]);
  const [loading, setLoading] = useState(true);

  // New post state
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('update');
  const [publishing, setPublishing] = useState(false);

  // Active comments input state
  const [commentInputs, setCommentInputs] = useState<{ [postId: number]: string }>({});

  const loadFeed = async () => {
    setLoading(true);
    try {
      const res = await apiFetch<{ results?: NetworkPost[] } | NetworkPost[]>('/network/feed/');
      setPosts(Array.isArray(res) ? res : (res.results || []));
    } catch (err) {
      console.error('Error loading network feed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentUser(getStoredUser());
    loadFeed();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getToken()) {
      router.push('/login?redirect=/network');
      return;
    }
    if (!content.trim()) return;

    setPublishing(true);
    try {
      await apiFetch('/network/feed/', {
        method: 'POST',
        body: JSON.stringify({
          content,
          post_type: postType,
        })
      });
      setContent('');
      loadFeed();
    } catch (err: any) {
      alert(err.message || 'Failed to publish post');
    } finally {
      setPublishing(false);
    }
  };

  const handleLikeToggle = async (postId: number) => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    try {
      const res = await apiFetch<{ is_liked: boolean; likes_count: number }>(`/network/posts/${postId}/like/`, {
        method: 'POST'
      });
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { ...p, is_liked: res.is_liked, likes_count: res.likes_count };
        }
        return p;
      }));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleAddComment = async (postId: number) => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    try {
      const newComment = await apiFetch<any>(`/network/posts/${postId}/comments/`, {
        method: 'POST',
        body: JSON.stringify({ content: text })
      });
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments_count: p.comments_count + 1,
            comments: [...(p.comments || []), newComment]
          };
        }
        return p;
      }));
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    } catch (err: any) {
      alert(err.message || 'Failed to comment');
    }
  };

  return (
    <Layout title="Professional Network — CheremoSphere">
      <div className="bg-[#0D2A5C] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <span className="text-xs font-bold text-[#FF7A00] tracking-wider uppercase">Professional Community</span>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1">CheremoSphere Network Feed</h1>
          <p className="text-blue-200 text-sm mt-1">
            Connect with verified professionals, employers, and entrepreneurs across Kenya & Africa.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Post Creation Box */}
        <div className="bg-white rounded-2xl border border-[#E6EBF2] p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0D2A5C] text-white flex items-center justify-center font-bold text-sm shrink-0">
              {currentUser ? currentUser.username[0].toUpperCase() : 'C'}
            </div>

            <div className="flex-1">
              <textarea
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share a career achievement, business milestone, or opportunity..."
                className="w-full p-3 rounded-xl bg-[#F4F7FB] border border-gray-200 text-sm outline-none focus:border-[#0D2A5C] focus:bg-white transition-all"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#5B6B82]">Topic:</span>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                    className="text-xs font-semibold text-[#0D2A5C] bg-[#F4F7FB] px-2.5 py-1.5 rounded-lg border border-gray-200 outline-none"
                  >
                    <option value="update">Professional Update</option>
                    <option value="achievement">Career Achievement</option>
                    <option value="opportunity">Opportunity Announcement</option>
                    <option value="business">Business Highlight</option>
                  </select>
                </div>

                <button
                  onClick={handleCreatePost}
                  disabled={publishing || !content.trim()}
                  className="btn-primary text-xs px-5 py-2 font-bold rounded-xl shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {publishing ? 'Publishing...' : 'Publish Update'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed Posts */}
        {loading ? (
          <div className="py-16 text-center text-[#5B6B82]">Loading community feed...</div>
        ) : posts.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-[#E6EBF2] text-center">
            <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-[#0D2A5C]">No posts published yet</h3>
            <p className="text-sm text-[#5B6B82] mt-1">Be the first to share an update with the CheremoSphere community.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl border border-[#E6EBF2] p-6 shadow-xs space-y-4">
                
                {/* Post Author Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#0D2A5C] text-white flex items-center justify-center font-bold text-sm">
                      {post.author.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-[#0D2A5C]">
                          {post.author.first_name ? `${post.author.first_name} ${post.author.last_name}` : post.author.username}
                        </h4>
                        {post.author.is_verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
                        )}
                      </div>
                      <p className="text-xs text-[#5B6B82] line-clamp-1">
                        {post.author.headline || post.author.location}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-[#FF7A00] bg-[#FFF1E5] px-2.5 py-1 rounded-md capitalize">
                    {post.post_type.replace('_', ' ')}
                  </span>
                </div>

                {/* Content */}
                <p className="text-sm text-[#24344D] leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Interaction Counts & Action Strip */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#5B6B82]">
                  <span>{post.likes_count} Likes • {post.comments_count} Comments</span>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLikeToggle(post.id)}
                      className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                        post.is_liked ? 'text-[#DC2626]' : 'hover:text-[#DC2626]'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={post.is_liked ? "#DC2626" : "none"} />
                      <span>{post.is_liked ? 'Liked' : 'Like'}</span>
                    </button>

                    <span className="flex items-center gap-1.5 font-semibold">
                      <MessageCircle className="w-4 h-4" />
                      <span>Comment</span>
                    </span>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="pt-3 border-t border-gray-100 space-y-3">
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-2">
                      {post.comments.map(c => (
                        <div key={c.id} className="bg-[#F4F7FB] p-3 rounded-xl text-xs space-y-0.5">
                          <p className="font-bold text-[#0D2A5C]">
                            {c.author.first_name ? `${c.author.first_name} ${c.author.last_name}` : c.author.username}
                          </p>
                          <p className="text-[#24344D]">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Write a supportive reply..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-[#F4F7FB] border border-gray-200 outline-none focus:border-[#0D2A5C]"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="p-2 rounded-xl bg-[#0D2A5C] text-white hover:bg-[#FF7A00] transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}
