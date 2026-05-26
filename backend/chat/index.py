import json
import os
import urllib.request
import urllib.error

SYSTEM_PROMPT = """Ты — АУРА, умный персональный ИИ-ассистент для бизнеса. Ты помогаешь:
- Управлять задачами и напоминаниями
- Создавать сценарии автоматизации
- Составлять планы, отчёты, письма
- Анализировать данные и давать советы
- Отвечать на любые вопросы по бизнесу и продуктивности

Отвечай по-русски, кратко и по делу. Будь дружелюбным, профессиональным. 
Используй markdown для форматирования: **жирный**, *курсив*, списки с дефисами, заголовки с ##.
Если тебя просят создать задачу — отвечай в формате: подтверди создание и назови её.
Если просят составить план — структурируй по пунктам."""


def handler(event: dict, context) -> dict:
    """Обработка чат-запросов к OpenAI GPT-4o."""

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

    api_key = os.environ.get('OPENAI_API_KEY', '')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'OPENAI_API_KEY не настроен'})
        }

    body = json.loads(event.get('body') or '{}')
    messages = body.get('messages', [])
    
    if not messages:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Нет сообщений'})
        }

    openai_messages = [{'role': 'system', 'content': SYSTEM_PROMPT}]
    for msg in messages:
        role = 'assistant' if msg.get('role') == 'ai' else msg.get('role', 'user')
        openai_messages.append({'role': role, 'content': msg.get('text', '')})

    payload = json.dumps({
        'model': 'gpt-4o-mini',
        'messages': openai_messages,
        'max_tokens': 1500,
        'temperature': 0.7,
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.openai.com/v1/chat/completions',
        data=payload,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        method='POST'
    )

    with urllib.request.urlopen(req, timeout=25) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    reply = result['choices'][0]['message']['content']

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'reply': reply})
    }
