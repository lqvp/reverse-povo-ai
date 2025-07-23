import os
import base64
import json
import time
from dotenv import load_dotenv

# .envファイルをロード
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

jwt_token = os.getenv("session")

if not jwt_token:
    print(".envのsession(JWT)が見つかりません")
    exit(1)

try:
    header_b64, payload_b64, signature_b64 = jwt_token.split('.')
    def b64decode(data):
        # base64urlデコード（パディング調整）
        data += '=' * (-len(data) % 4)
        return base64.urlsafe_b64decode(data)

    header = json.loads(b64decode(header_b64))
    payload = json.loads(b64decode(payload_b64))

    print("=== JWT Header ===")
    print(json.dumps(header, indent=2, ensure_ascii=False))
    print("\n=== JWT Payload ===")
    print(json.dumps(payload, indent=2, ensure_ascii=False))

    # exp, iat, iss などの検証
    now = int(time.time())
    exp = payload.get('exp')
    iat = payload.get('iat')
    iss = payload.get('iss')

    print(f"\n現在時刻: {now} ({time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(now))})")
    if iat:
        print(f"発行(iat): {iat} ({time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(iat))})")
    if exp:
        print(f"有効期限(exp): {exp} ({time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(exp))})")
        if now > exp:
            print("→ JWTは有効期限切れです")
        else:
            print("→ JWTは有効です")
    if iss:
        print(f"issuer(iss): {iss}")

except Exception as e:
    print(f"JWTのデコード・検証に失敗: {e}") 