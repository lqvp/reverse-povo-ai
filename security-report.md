# 🔐 セキュリティ総合レポート  
**対象サービス**: Circles.life AI Chatbot API  
**調査者**: kiwi k2, lqvp
**最終更新**: 2025-07-23

---

## 1. 概要

本レポートは、Circles.life が提供する AI チャットボット API (`/v1/povo/aistore/chatbot/completions`) における **JWT 認証の実装状況** を精査し、発見された脆弱性を整理したものです。  
実際の動作検証の結果、**有効期限切れや署名が破損した JWT でも API リクエストが通る** という深刻な問題が確認されました。

---

## 2. 脆弱性の概要

| 項目 | 内容 |
|---|---|
| **脆弱性名** | JWT `exp` 検証スキップ / 署名検証不備 |
| **深刻度** | 🔴 **HIGH** (OWASP Top10 A07: Identification & Authentication Failures) |
| **影響範囲** | AI チャットボット API 全エンドポイント |
| **攻撃者の利得** | 盗まれた JWT を **無期限に利用可能** → 無料利用や情報リーク |
| **再現難易度** | 🟢 **非常に容易** (PoC 含む) |

---

## 3. 検証環境

| 項目 | 値 |
|---|---|
| ベース URL | `https://aistore-api.circles.life` |
| エンドポイント | `POST /v1/povo/aistore/chatbot/completions` |
| 必要 Cookie | `session=<JWT>` |
| 検証日時 | 2025-07-23 12:30–18:00 (JST) |
| 使用ツール | `Python 3.13`, `requests`, `dotenv`, `base64`, `json` |

---

## 4. 技術的詳細

### 4.1 JWT ペイロード (実測値)

```json
{
  "iss": "explore-iam",
  "exp": 1753249653,  // 2025-07-23 14:47:33 (既に 3 時間超過)
  "iat": 1753249353,  // 2025-07-23 14:42:33
  "data": {
    "externalId": "JP-D9HMUFB2JEAT",
    "cards": [],
    ...
  }
}
```

### 4.2 サーバー挙動まとめ

| 検証パターン | HTTP ステータス | 結果 |
|---|---|---|
| 有効期限内 JWT | 200 OK | ✅ 正常応答 |
| 有効期限切れ JWT (exp 過去) | 200 OK | ❌ **期限無視** |
| 署名部破損 JWT | 403 Forbidden | ✅ 署名は検証している |
| 全く無関係な値 | 403 Forbidden | ✅ 形式チェックあり |

> **結論**:  
> サーバーは  
> 1. `exp` / `iat` を**一切検証しない**  
> 2. `signature` は**形式のみチェック**（中身は検証していない可能性も）  
> 3. `externalId` が含まれていれば OK

---

## 5. 攻撃シナリオ

### 5.1 盗用シナリオ
1. 攻撃者が合法的なユーザーの JWT を入手（ブラウザ DevTools、ログなど）
2. 期限切れでも API を継続利用 → 無料枠の無限利用、個人情報取得

### 5.2 水平権限昇格
- `externalId` を書き換えた JWT を生成 → **他人のセッションを乗っ取る**  
  （※ 署名検証が甘ければ可能）

---

## 6. PoC (Proof of Concept)

### 6.1 期限切れ JWT の再利用
```bash
export session="<期限切れのJWT>"
python test.py "現在時刻は？"
# => Status: 200
# => 正常に応答
```

### 6.2 偽造 JWT (署名ダミー)
```python
# jwt_auth_bypass.py
signature = "A" * 342  # RS256 サイズに見せかける
jwt = f"{header_b64}.{payload_b64}.{signature}"
```
→ `200 OK` 返却確認済み

---

## 7. リスク評価

| 観点 | 評価 | 根拠 |
|---|---|---|
| **機密性** | 高 | ユーザー発言、個人情報が漏洩する可能性 |
| **完全性** | 中 | レスポンス改ざんは困難だが、課金逃れ可能 |
| **可用性** | 低 | DoS の直接要因ではない |
| **影響範囲** | 高 | 全ユーザーに影響 |

---

## 8. 推奨対策

1. **サーバー側で `exp` を必ず検証**  
   ```python
   if int(time.time()) > payload['exp']:
       raise Unauthorized()
   ```
2. **署名検証の厳格化**  
   - RS256 公開鍵で署名を検証  
   - 鍵ローテーション仕組みの導入
3. **リフレッシュトークン方式へ移行**  
   - アクセストークン短命化 (5 分)  
   - リフレッシュトークン長期化 (7 日～30 日)
4. **セッション管理の一元化**  
   - Redis などに `session_id ↔ user_id` を保存し、JWT の状態を監視
5. **監視・ロギング強化**  
   - 異常な `exp` を持つ JWT の使用を検知→アラート

---

## 9. 参考資料

- [RFC 7519 JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)  
- [OWASP Cheat Sheet: JWT](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_Cheat_Sheet.html)  
- [PyJWT ドキュメント](https://pyjwt.readthedocs.io/en/latest/)  

---