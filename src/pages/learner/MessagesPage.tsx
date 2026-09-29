import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageSquare, Phone, MoreVertical, Calendar } from 'lucide-react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { mockConversations } from '@/data/mockMessages';
import { formatRelativeTime, formatTime } from '@/utils/format';
import { cn } from '@/utils/cn';
import type { Conversation, Message } from '@/types';

export function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [active, setActive] = useState<Conversation | null>(mockConversations[0]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages]);

  const sendMessage = () => {
    if (!input.trim() || !active) return;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: active.id,
      senderId: 'u1',
      senderName: 'Aditi Singh',
      content: input.trim(),
      timestamp: new Date().toISOString(),
      isRead: true,
      type: 'text',
    };
    const updated: Conversation = {
      ...active,
      messages: [...active.messages, newMsg],
      lastMessage: input.trim(),
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
    };
    setActive(updated);
    setConversations((prev) => prev.map((c) => (c.id === active.id ? updated : c)));
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const selectConv = (conv: Conversation) => {
    setActive({ ...conv, unreadCount: 0 });
    setConversations((prev) => prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c)));
  };

  return (
    <DashboardLayout title="Messages">
      <div className="card overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        <div className="flex h-full">
          {/* Conversation list */}
          <aside className="w-72 shrink-0 border-r border-[#E2E8F0] dark:border-[#1E293B] flex flex-col">
            <div className="p-3 border-b border-[#E2E8F0] dark:border-[#1E293B]">
              <input type="search" placeholder="Search conversations…" className="input-base py-2 text-xs" />
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => selectConv(conv)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors',
                    active?.id === conv.id && 'bg-indigo-50 dark:bg-indigo-950/20'
                  )}
                >
                  <Avatar src={conv.participantAvatar} name={conv.participantName} size="md" online={conv.isOnline} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={cn('text-sm font-medium truncate', active?.id === conv.id ? 'text-indigo-700 dark:text-indigo-300' : 'text-[#0F172A] dark:text-slate-100')}>
                        {conv.participantName}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">{formatRelativeTime(conv.lastMessageTime).replace(' ago', '')}</span>
                    </div>
                    {conv.relatedSkill && (
                      <p className="text-[10px] text-indigo-500 dark:text-indigo-400 font-medium">{conv.relatedSkill}</p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          {/* Chat window */}
          {active ? (
            <div className="flex-1 flex flex-col min-w-0">
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-3 border-b border-[#E2E8F0] dark:border-[#1E293B] shrink-0">
                <Avatar src={active.participantAvatar} name={active.participantName} size="md" online={active.isOnline} />
                <div className="flex-1">
                  <p className="font-semibold text-[#0F172A] dark:text-slate-100 text-sm">{active.participantName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {active.isOnline ? 'Online now' : 'Offline'}{active.relatedSkill ? ` · ${active.relatedSkill}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button className="btn-ghost p-2" aria-label="Schedule session">
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button className="btn-ghost p-2" aria-label="More options">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {active.messages.map((msg) => {
                  const isOwn = msg.senderId === 'u1';
                  return (
                    <div key={msg.id} className={cn('flex items-end gap-2', isOwn && 'flex-row-reverse')}>
                      {!isOwn && (
                        <Avatar src={active.participantAvatar} name={active.participantName} size="xs" />
                      )}
                      <div className={cn('max-w-[70%] space-y-1', isOwn && 'items-end flex flex-col')}>
                        <div className={cn(
                          'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                          isOwn
                            ? 'bg-indigo-600 text-white rounded-br-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-[#0F172A] dark:text-slate-100 rounded-bl-sm'
                        )}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-slate-400 px-1">
                          {formatRelativeTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-5 py-3 border-t border-[#E2E8F0] dark:border-[#1E293B] shrink-0">
                <div className="flex items-center gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message…"
                    className="input-base flex-1 py-2.5"
                    aria-label="Message input"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="btn-primary p-2.5 rounded-xl disabled:opacity-40"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={<MessageSquare className="w-6 h-6" />}
                title="No conversation selected"
                description="Pick a conversation from the list to start messaging."
              />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
