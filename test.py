import requests
import json
import sys
import os
from dotenv import load_dotenv

load_dotenv()

url = "https://aistore-api.circles.life/v1/povo/aistore/chatbot/completions"

session_cookie = os.getenv("session")

headers = {
    "Content-Type": "application/json",
    "Cookie": f"session={session_cookie}",
}

if len(sys.argv) > 1:
    user_prompt = sys.argv[1]
else:
    user_prompt = "猫って何？"

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

    raw_text = response.content.decode("utf-8", errors="ignore")

    json_start_index = raw_text.find('{"data":')

    if json_start_index != -1:
        text_part = raw_text[:json_start_index]
        json_part_str = raw_text[json_start_index:]

        print("Response Text:")
        print(text_part.strip())

        last_brace_index = json_part_str.rfind("}")
        parsed_json = None

        while last_brace_index != -1:
            potential_json_str = json_part_str[: last_brace_index + 1]
            try:
                parsed_json = json.loads(potential_json_str)
                print("\nResponse JSON:")
                print(json.dumps(parsed_json, indent=2, ensure_ascii=False))
                break
            except json.JSONDecodeError:
                last_brace_index = json_part_str.rfind("}", 0, last_brace_index)

        if not parsed_json:
            print("\nCould not parse JSON from the response.")
            print("Raw JSON part:")
            print(json_part_str)
    else:
        print("Response Text:")
        print(raw_text)


except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e}")
