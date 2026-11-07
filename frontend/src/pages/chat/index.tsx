import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  MessageSquare,
  Send,
  ArrowLeft,
  Search,
  Paperclip,
  Shield,
} from 'lucide-react';
import Layout from '@/components/Layout';
import {
  apiFetch,
  getToken,
  getStoredUser,
  Conversation,
  User as UserType,
} from '@/lib/api';

interface ChatMessage {
  id: number;
  sender: UserType | null;
  text: string;
  is_read: boolean;
  created_at: string;
}

function extractArray<T>(
  data: unknown,
  keys: string[] = ['results', 'data', 'items', 'messages', 'conversations']
): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (data && typeof data === 'object') {
    const response = data as Record<string, unknown>;

    for (const key of keys) {
      if (response[key] !== undefined) {
        const result = extractArray<T>(response[key], keys);

        if (result.length > 0 || Array.isArray(response[key])) {
          return result;
        }
      }
    }
  }

  return [];
}

export default function ChatPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }, 100);
  };

  // Load conversations
  const loadConversations = async () => {
    try {
      const response = await apiFetch<unknown>('/chat/conversations/');

      const conversationList = extractArray<Conversation>(
        response,
        ['results', 'data', 'conversations', 'items']
      );

      setConversations(conversationList);

      if (conversationList.length > 0) {
        setActiveConvId((previousId) => {
          if (
            previousId !== null &&
            conversationList.some((c) => c.id === previousId)
          ) {
            return previousId;
          }

          const requestedId = router.query.id
            ? Number(router.query.id)
            : null;

          const requestedConversation = conversationList.find(
            (c) => c.id === requestedId
          );

          return requestedConversation
            ? requestedConversation.id
            : conversationList[0].id;
        });
      } else {
        setActiveConvId(null);
        setActiveMessages([]);
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  // Load messages for the selected conversation
  const loadMessages = async (convId: number) => {
    try {
      setLoadingMessages(true);

      const response = await apiFetch<unknown>(
        `/chat/conversations/${convId}/`
      );

      let messageData: unknown = [];

      if (Array.isArray(response)) {
        messageData = response;
      } else if (response && typeof response === 'object') {
        const data = response as Record<string, unknown>;

        messageData =
          data.messages ??
          data.results ??
          data.data ??
          data.items ??
          [];
      }

      const messages = extractArray<ChatMessage>(messageData);

      setActiveMessages(messages);

      scrollToBottom();
    } catch (err) {
      console.error('Error loading messages:', err);

      setActiveMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Authentication and initial loading
  useEffect(() => {
    if (!router.isReady) return;

    if (!getToken()) {
      router.push('/login?redirect=/chat');
      return;
    }

    setCurrentUser(getStoredUser());
    loadConversations();
  }, [router.isReady]);

  // Load messages whenever the selected conversation changes
  useEffect(() => {
    if (!activeConvId) {
      setActiveMessages([]);
      return;
    }

    let mounted = true;

    const fetchMessages = async () => {
      try {
        const response = await apiFetch<unknown>(
          `/chat/conversations/${activeConvId}/`
        );

        if (!mounted) return;

        let messageData: unknown = [];

        if (Array.isArray(response)) {
          messageData = response;
        } else if (response && typeof response === 'object') {
          const data = response as Record<string, unknown>;

          messageData =
            data.messages ??
            data.results ??
            data.data ??
            data.items ??
            [];
        }

        const messages = extractArray<ChatMessage>(messageData);

        setActiveMessages(messages);

        scrollToBottom();
      } catch (err) {
        console.error('Error loading messages:', err);

        if (mounted) {
          setActiveMessages([]);
        }
      }
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 4000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [activeConvId]);

  // Send a message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputText.trim() || !activeConvId || sending) return;

    if (!getToken()) {
      router.push('/login?redirect=/chat');
      return;
    }

    setSending(true);

    const msgToSend = inputText.trim();

    setInputText('');

    try {
      const response = await apiFetch<unknown>(
        `/chat/conversations/${activeConvId}/send/`,
        {
          method: 'POST',
          body: JSON.stringify({
            text: msgToSend,
          }),
        }
      );

      let newMessage: ChatMessage | null = null;

      if (response && typeof response === 'object') {
        const data = response as Record<string, unknown>;

        newMessage = (
          data.message && typeof data.message === 'object'
            ? data.message
            : response
        ) as ChatMessage;
      }

      if (newMessage && newMessage.id) {
        setActiveMessages((previous) => [
          ...(Array.isArray(previous) ? previous : []),
          newMessage!,
        ]);
      } else {
        await loadMessages(activeConvId);
      }

      scrollToBottom();
    } catch (err: unknown) {
      console.error('Message sending failed:', err);

      setInputText(msgToSend);

      alert(
        err instanceof Error
          ? err.message
          : 'Could not deliver message. Please try again.'
      );
    } finally {
      setSending(false);
    }
  };

  // Safely find active conversation
  const activeConversation = conversations.find(
    (c) => c.id === activeConvId
  );

  const participants = Array.isArray(activeConversation?.participants)
    ? activeConversation.participants
    : [];

  const otherParticipant =
    participants.find((p) => p?.id !== currentUser?.id) ||
    participants[0] ||
    null;

  const getInitial = (username?: string | null) => {
    return username?.trim()?.[0]?.toUpperCase() || 'U';
  };

  const getDisplayName = (user: UserType | null | undefined) => {
    if (!user) return 'Unknown User';

    if (user.first_name) {
      return `${user.first_name} ${user.last_name || ''}`.trim();
    }

    return user.username || 'Unknown User';
  };

  return (
    <Layout title="Messages & Chat — CheremoSphere">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-white rounded-3xl border border-[#E6EBF2] shadow-sm overflow-hidden h-[75vh] min-h-[500px] grid grid-cols-1 md:grid-cols-12">

          {/* Left Sidebar: Conversations List */}

          <div className="md:col-span-4 border-r border-[#E6EBF2] flex flex-col bg-[#F4F7FB]/50">

            <div className="p-4 border-b border-[#E6EBF2] bg-white">

              <h2 className="text-lg font-bold text-[#0D2A5C]">
                Direct Messages
              </h2>

              <p className="text-xs text-[#5B6B82]">
                Encrypted & private communication
              </p>

            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">

              {loading ? (

                <div className="p-6 text-center text-xs text-[#5B6B82]">
                  Loading conversations...
                </div>

              ) : conversations.length === 0 ? (

                <div className="p-8 text-center text-xs text-[#5B6B82] space-y-2">

                  <MessageSquare className="w-8 h-8 text-gray-300 mx-auto" />

                  <p className="font-semibold text-[#0D2A5C]">
                    No active conversations
                  </p>

                  <p>
                    Inquire on a job, candidate broadcast, or marketplace listing to begin chatting.
                  </p>

                </div>

              ) : (

                conversations.map((c) => {

                  const conversationParticipants = Array.isArray(c.participants)
                    ? c.participants
                    : [];

                  const partner =
                    conversationParticipants.find(
                      (p) => p?.id !== currentUser?.id
                    ) || conversationParticipants[0];

                  const isSelected = c.id === activeConvId;

                  return (

                    <button
                      key={c.id}
                      onClick={() => setActiveConvId(c.id)}
                      className={`w-full text-left p-4 transition-colors flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-white border-l-4 border-[#FF7A00] shadow-xs'
                          : 'hover:bg-white/80'
                      }`}
                    >

                      <div className="w-10 h-10 rounded-full bg-[#0D2A5C] text-white flex items-center justify-center font-bold text-xs shrink-0">

                        {getInitial(partner?.username)}

                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex items-center justify-between">

                          <h4 className="text-xs font-bold text-[#0D2A5C] truncate">

                            {getDisplayName(partner)}

                          </h4>

                          {(c.unread_count || 0) > 0 && (

                            <span className="w-4 h-4 rounded-full bg-[#FF7A00] text-white text-[10px] font-bold flex items-center justify-center">

                              {c.unread_count}

                            </span>

                          )}

                        </div>

                        <p className="text-[11px] text-[#5B6B82] truncate mt-0.5">

                          {c.latest_message?.text ||
                            c.subject ||
                            'New Conversation'}

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

                      {getInitial(otherParticipant.username)}

                    </div>

                    <div>

                      <h3 className="text-sm font-bold text-[#0D2A5C]">

                        {getDisplayName(otherParticipant)}

                      </h3>

                      <p className="text-[11px] text-[#5B6B82]">

                        {otherParticipant.headline ||
                          otherParticipant.location ||
                          'CheremoSphere Member'}

                      </p>

                    </div>

                  </div>

                  <span className="text-[11px] font-semibold text-[#16A34A] bg-green-50 px-2.5 py-1 rounded-full">

                    Active on CheremoSphere

                  </span>

                </div>

                {/* Message History */}

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F4F7FB]/30">

                  {loadingMessages && activeMessages.length === 0 ? (

                    <div className="text-center text-xs text-[#5B6B82] py-6">
                      Loading messages...
                    </div>

                  ) : activeMessages.length === 0 ? (

                    <div className="text-center text-xs text-[#5B6B82] py-10">

                      <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />

                      <p>No messages yet. Start the conversation!</p>

                    </div>

                  ) : (

                    activeMessages.map((msg) => {

                      const isMe =
                        msg.sender?.id === currentUser?.id;

                      const messageText =
                        typeof msg.text === 'string'
                          ? msg.text
                          : '';

                      const messageDate = msg.created_at
                        ? new Date(msg.created_at)
                        : null;

                      const formattedTime =
                        messageDate &&
                        !Number.isNaN(messageDate.getTime())
                          ? messageDate.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '';

                      return (

                        <div
                          key={msg.id}
                          className={`flex flex-col ${
                            isMe ? 'items-end' : 'items-start'
                          }`}
                        >

                          <div
                            className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                              isMe
                                ? 'bg-[#0D2A5C] text-white rounded-tr-xs'
                                : 'bg-white border border-[#E6EBF2] text-[#24344D] rounded-tl-xs'
                            }`}
                          >

                            <p>{messageText}</p>

                          </div>

                          <span className="text-[10px] text-[#5B6B82] mt-1 px-1">

                            {formattedTime}

                          </span>

                        </div>

                      );

                    })

                  )}

                  <div ref={messagesEndRef} />

                </div>

                {/* Send Message Input */}

                <form
                  onSubmit={handleSendMessage}
                  className="p-3 border-t border-[#E6EBF2] flex items-center gap-2"
                >

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

                <h3 className="text-base font-bold text-[#0D2A5C]">
                  Select a Conversation
                </h3>

                <p className="text-xs max-w-sm">
                  Choose a chat from the left or contact a seller, employer, or candidate.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

    </Layout>
  );
}