import func2url from '../../backend/func2url.json';

export const CHAT_URL = func2url.chat;
export const SAVE_KEY_URL = func2url['save-key'];

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
  if (res.status === 402) throw new Error('no_key');
  if (!res.ok) throw new Error(data.message || data.error || 'Ошибка сервера');
  return data.reply;
}

export async function checkKey(): Promise<{ has_key: boolean; masked?: string }> {
  const res = await fetch(SAVE_KEY_URL, { method: 'GET' });
  return res.json();
}

export async function saveKey(api_key: string): Promise<{ ok?: boolean; error?: string }> {
  const res = await fetch(SAVE_KEY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key }),
  });
  return res.json();
}
