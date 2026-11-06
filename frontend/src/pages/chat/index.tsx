import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { 
  MessageSquare, Send, User, Check, CheckCheck, 
  ArrowLeft, Search, Paperclip, Shield 
} from 'lucide-react';
import Layout from '@/components/Layout';
import { apiFetch, getToken, getStoredUser, Conversation, User as UserType } from '@/lib/api';

interface ChatMessage {
  id: number;
  sender: UserType;
  text: string;
  is_read: boolean;
  created_at: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    try {
      const res = await apiFetch<Conversation[]>('/chat/conversations/');
      setConversations(res);
      if (res.length > 0 && !activeConvId) {
        const queryId = router.query.id ? parseInt(router.query.id as string) : res[0].id;
        setActiveConvId(queryId);
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (convId: number) => {
    try {
      const res = await apiFetch<{ conversation: Conversation; messages: ChatMessage[] }>(`/chat/conversations/${convId}/`);
      setActiveMessages(res.messages);
      scrollToBottom();
    } catch (err) {
      console.error('Error loading messages:', err);
    }
  };

  useEffect(() => {
    if (!getToken()) {
      router.push('/login?redirect=/chat');
      return;
    }
    setCurrentUser(getStoredUser());
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
      const interval = setInterval(() => loadMessages(activeConvId), 4000);
      return () => clearInterval(interval);
    }
  }, [activeConvId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    setSending(true);
    const msgToSend = inputText.trim();
    setInputText('');

    try {
      const newMsg = await apiFetch<ChatMessage>(`/chat/conversations/${activeConvId}/send/`, {
        method: 'POST',
        body: JSON.stringify({ text: msgToSend })
      });
      setActiveMessages(prev => [...prev, newMsg]);
      scrollToBottom();
    } catch (err: any) {
      alert(err.message || 'Could not deliver message.');
    } finally {
      setSending(false);
    }
  };

  const activeConversation = conversations.find(c => c.id === activeConvId);
  const otherParticipant = activeConversation?.participants.find((p: any) => p.id !== currentUser?.id);

  return (
    <Layout title="Messages & Chat — CheremoSphere">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="bg-white rounded-3xl border border-[#E6EBF2] shadow-sm overflow-hidden h-[75vh] min-h-[500px] grid grid-cols-1 md:grid-cols-12">
          
          {/* Left Sidebar: Conversations List */}
          <div className="md:col-span-4 border-r border-[#E6EBF2] flex flex-col bg-[#F4F7FB]/50">
            <div className="p-4 border-b border-[#E6EBF2] bg-white">
              <h2 className="text-lg font-bold text-[#0D2A5C]">Direct Messages</h2>
              <p className="text-xs text-[#5B6B82]">Encrypted & private communication</p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {loading ? (
                <div className="p-6 text-center text-xs text-[#5B6B82]">Loading conversations...</div>
              ) : conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#5B6B82] space-y-2">
                  <MessageSquare className="w-8 h-8 text-gray-300 mx-auto" />
                  <p className="font-semibold text-[#0D2A5C]">No active conversations</p>
                  <p>Inquire on a job, candidate broadcast, or marketplace listing to begin chatting.</p>
                </div>
              ) : (
                conversations.map(c => {
                  const partner = c.participants.find((p: any) => p.id !== currentUser?.id) || c.participants[0];
                  const isSelected = c.id === activeConvId;

                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveConvId(c.id)}
                      className={`w-full text-left p-4 transition-colors flex items-start gap-3 cursor-pointer ${
                        isSelected ? 'bg-white border-l-4 border-[#FF7A00] shadow-xs' : 'hover:bg-white/80'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#0D2A5C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {partner?.username[0].toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-[#0D2A5C] truncate">
                            {partner?.first_name ? `${partner.first_name} ${partner.last_name}` : partner?.username}
                          </h4>
                          {c.unread_count > 0 && (
                            <span className="w-4 h-4 rounded-full bg-[#FF7A00] text-white text-[10px] font-bold flex items-center justify-center">
                              {c.unread_count}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#5B6B82] truncate mt-0.5">
                          {c.latest_message ? c.latest_message.text : c.subject || 'New Conversation'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Conversation Thread */}
          <div className="md:col-span-8 flex flex-col bg-white">
            {activeConvId && otherParticipant ? (
              <>
                {/* Active Chat Header */}
                <div className="p-4 border-b border-[#E6EBF2] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0D2A5C] text-white flex items-center justify-center font-bold text-xs">
                      {otherParticipant.username[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0D2A5C]">
                        {otherParticipant.first_name ? `${otherParticipant.first_name} ${otherParticipant.last_name}` : otherParticipant.username}
                      </h3>
                      <p className="text-[11px] text-[#5B6B82]">
                        {otherParticipant.headline || otherParticipant.location}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-[#16A34A] bg-green-50 px-2.5 py-1 rounded-full">
                    Active on CheremoSphere
                  </span>
                </div>

                {/* Message History */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F4F7FB]/30">
                  {activeMessages.map(msg => {
                    const isMe = msg.sender.id === currentUser?.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isMe
                              ? 'bg-[#0D2A5C] text-white rounded-tr-xs'
                              : 'bg-white border border-[#E6EBF2] text-[#24344D] rounded-tl-xs'
                          }`}
                        >
                          <p>{msg.text}</p>
                        </div>
                        <span className="text-[10px] text-[#5B6B82] mt-1 px-1">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Send Message Input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-[#E6EBF2] flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 px-4 py-3 bg-[#F4F7FB] border border-transparent focus:border-[#0D2A5C] focus:bg-white rounded-xl text-xs sm:text-sm outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputText.trim()}
                    className="p-3 rounded-xl bg-[#FF7A00] hover:bg-[#E66E00] text-white transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#5B6B82] space-y-2">
                <MessageSquare className="w-12 h-12 text-gray-300" />
                <h3 className="text-base font-bold text-[#0D2A5C]">Select a Conversation</h3>
                <p className="text-xs max-w-sm">Choose a chat from the left or contact a seller, employer, or candidate.</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </Layout>
  );
}
