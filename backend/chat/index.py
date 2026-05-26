import json
import os
import re
import urllib.request
import psycopg2

SYSTEM_PROMPT = """Ты — АУРА, умный персональный ИИ-ассистент для бизнеса. Ты помогаешь:
- Управлять задачами и напоминаниями
- Создавать сценарии автоматизации
- Составлять планы, отчёты, письма
- Анализировать данные и давать советы
- Отвечать на любые вопросы по бизнесу и продуктивности

Отвечай по-русски, кратко и по делу. Будь дружелюбным, профессиональным.
Используй markdown для форматирования: **жирный**, *курсив*, списки с дефисами, заголовки с ##.
Если тебя просят создать задачу — подтверди создание и назови её.
Если просят составить план — структурируй по пунктам."""


def handler(event: dict, context) -> dict:
    """Обработка чат-запросов через OpenRouter. Ключ читается из БД."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()
    cur.execute("SELECT value FROM app_settings WHERE key = 'openrouter_key'")
    row = cur.fetchone()
    cur.close()
    conn.close()

    if not row:
        return {
            'statusCode': 402,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'no_key', 'message': 'API-ключ не настроен'})
        }

    api_key = row[0]

    body = json.loads(event.get('body') or '{}')
    messages = body.get('messages', [])

    if not messages:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Нет сообщений'})
        }

    chat_messages = [{'role': 'system', 'content': SYSTEM_PROMPT}]
    for msg in messages:
        role = 'assistant' if msg.get('role') == 'ai' else msg.get('role', 'user')
        chat_messages.append({'role': role, 'content': msg.get('text', '')})

    payload = json.dumps({
        'model': 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
        'messages': chat_messages,
        'max_tokens': 2000,
        'temperature': 0.7,
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://openrouter.ai/api/v1/chat/completions',
        data=payload,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://poehali.dev',
            'X-Title': 'AURA Assistant',
        },
        method='POST'
    )

    with urllib.request.urlopen(req, timeout=60) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    reply = result['choices'][0]['message']['content']
    reply = re.sub(r'<think>.*?</think>', '', reply, flags=re.DOTALL).strip()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'reply': reply})
    }