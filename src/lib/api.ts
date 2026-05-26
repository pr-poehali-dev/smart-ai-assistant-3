import func2url from '../../backend/func2url.json';

export const CHAT_URL = func2url.chat;

export interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const res = await fetch(CHAT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Ошибка сервера');
  return data.reply;
}
