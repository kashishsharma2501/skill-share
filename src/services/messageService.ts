/**
 * Message service — mock implementation.
 */
import { mockConversations } from '@/data/mockMessages';
import type { Conversation, Message } from '@/types';

export async function getConversations(_userId: string): Promise<Conversation[]> {
  await new Promise((r) => setTimeout(r, 200));
  return mockConversations;
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  content: string
): Promise<Message> {
  await new Promise((r) => setTimeout(r, 150));
  const msg: Message = {
    id: `m-${Date.now()}`,
    conversationId,
    senderId,
    senderName,
    content,
    timestamp: new Date().toISOString(),
    isRead: false,
    type: 'text',
  };
  // In a real app: POST /api/messages or WebSocket emit
  return msg;
}
