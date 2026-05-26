import json
import os
import psycopg2  # noqa


def handler(event: dict, context) -> dict:
    """Сохранение API-ключа OpenRouter в базу данных."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    method = event.get('httpMethod', 'GET')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    cur = conn.cursor()

    if method == 'GET':
        cur.execute("SELECT value FROM app_settings WHERE key = 'openrouter_key'")
        row = cur.fetchone()
        cur.close()
        conn.close()
        has_key = row is not None and bool(row[0])
        masked = None
        if has_key:
            v = row[0]
            masked = v[:8] + '••••••••' + v[-4:] if len(v) > 12 else '••••••••••••'
        return {
            'statusCode': 200,
            'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
            'body': json.dumps({'has_key': has_key, 'masked': masked})
        }

    body = json.loads(event.get('body') or '{}')
    api_key = (body.get('api_key') or '').strip()

    if not api_key.startswith('sk-or-'):
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Неверный формат ключа. Должен начинаться с sk-or-'})
        }

    cur.execute(
        "INSERT INTO app_settings (key, value, updated_at) VALUES ('openrouter_key', %s, NOW()) "
        "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()",
        (api_key,)
    )
    conn.commit()
    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'ok': True})
    }