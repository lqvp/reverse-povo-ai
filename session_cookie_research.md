# チャットボットAPIの session クッキー生成に関する調査まとめ

## 1. JWTトークンのデコード結果

```
Header
{
  "alg": "RS256",
  "typ": "JWT"
}

Payload
{
  "iss": "explore-iam",
  "exp": 1753249653,
  "iat": 1753249353,
  "data": {
    "externalId": "JP-D9HMUFB2JEAT",
    ...
  }
}
```
- issuer: `explore-iam`（IAMシステム）
- externalId: `JP-D9HMUFB2JEAT`（ユーザー識別子）
- 有効期限: 約5分

## 2. externalIdの取得方法
- URLパラメータ `aistore_external_id` から取得
  - 例: `https://.../?aistore_external_id=JP-D9HMUFB2JEAT`
- コード例（JS）:
  ```js
  export const getExternalIdFromParams = () => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('aistore_external_id')
  }
  ```

## 3. 認証フローの概要
- アプリ起動時に `/verify` エンドポイントを呼び出す
- Authorizationヘッダーに externalId をセット
- サーバーが session クッキー（JWT）を発行
- 以降のAPIリクエストでこのクッキーを利用

## 4. sessionクッキー生成の再現コード（Python例）
```python
import requests

def generate_session_cookie(external_id):
    url = "https://aistore-api.circles.life/v1/povo/aistore/verify"
    headers = {
        "Authorization": external_id,
        "Content-Type": "application/json",
        "X-Request-Id": "your-request-id"
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    cookies = response.cookies
    return cookies.get('session')

# 使用例
external_id = "JP-D9HMUFB2JEAT"
session_cookie = generate_session_cookie(external_id)
```

## 5. 現状の不明点・注意点
- `/verify` エンドポイントは HAR ファイル上では 404 を返している（本番環境での動作要確認）
- サーバーが期待する認証情報の詳細（Bearer等）や追加パラメータが不明
- sessionクッキーの発行元（explore-iam）のAPI仕様が未特定
- JWTの有効期限が短い（約5分）ため、都度再取得が必要

## 6. JWTの有効期限(exp)切れでもAPIリクエストが通る現象について

### 現象
- 明らかに有効期限(exp)が過ぎたJWT（sessionクッキー）でも、APIリクエストが正常に通ることを確認。

### 推測される理由
1. **サーバー側でJWTのexpを検証していない**
   - サーバーがJWTの有効期限（exp）を無視している、または検証ロジックにバグがある可能性。
2. **sessionクッキーの値は実際にはJWTとして使われていない**
   - クッキーの値はJWT形式だが、サーバーはそれを「セッションID」としてしか見ていない（中身をdecode/verifyしていない）場合。
3. **サーバー側で一度セッションを作ったら、JWTのexpに関係なく有効**
   - 最初のリクエストでセッションが作られ、その後はexpに関係なくセッションID（JWT）が有効な間は通る設計。
4. **検証環境・APIの仕様が特殊**
   - 本番ではexpを厳密に見ているが、開発・検証環境では緩い、など。
5. **APIの認証自体が形骸化している**
   - そもそも認証が形だけで、実際には何も検証していない。

### 追加で調べる方法
- 明らかに壊れたJWT（署名部を壊す、expを過去にする、payloadを変える）でリクエストしてみる。
  - それでも通るなら、サーバーはJWTの中身を全く見ていない可能性が高い。
- 全く無関係な値をsessionに入れてリクエストしてみる。
  - それでも通るなら、session自体が不要な可能性すらある。

### 結論
- expが切れても通るのは「普通ではない」挙動。
- サーバーがJWTのexpを検証していない、もしくはsessionクッキーの値を「ただのID」としてしか見ていない可能性が高い。
- 認証設計が緩い、もしくはバグの可能性も考えられる。

---

## 7. JWT有効期限切れでもAPIが通る現象の再現例

- 2025-07-23 14:47:33で失効したJWT（sessionクッキー）を使い、2025-07-23 17:13:46にAPIリクエストを実行
- サーバーは200で正常応答
- jwt_decode_check.pyでは「JWTは有効期限切れ」と判定

### 実際の検証ログ例
```
=== JWT Header ===
{
  "alg": "RS256",
  "typ": "JWT"
}

=== JWT Payload ===
{
  "iss": "explore-iam",
  "exp": 1753249653,
  "iat": 1753249353,
  "data": { ... }
}

現在時刻: 1753258426 (2025-07-23 17:13:46)
発行(iat): 1753249353 (2025-07-23 14:42:33)
有効期限(exp): 1753249653 (2025-07-23 14:47:33)
→ JWTは有効期限切れです
issuer(iss): explore-iam

# test.pyでAPIリクエスト
Status Code: 200
Response Text: ...（正常な応答）
```

### 考察
- サーバーはJWTのexp（有効期限）を全く検証していない
- sessionクッキーの値を「JWTとして」ではなく「ただのID」としてしか見ていない可能性
- 認証設計が非常に緩い、もしくはバグの可能性

### 追加検証案
- session値を壊しても通るかどうか
- JWTのpayloadや署名部を壊しても通るかどうか
- それでも通る場合、認証自体がほぼ無意味な状態

---

**このまとめは2025年7月時点の調査結果です。追加情報が得られた場合は随時追記してください。** 