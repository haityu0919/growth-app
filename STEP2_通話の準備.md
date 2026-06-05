# ステップ2 — ランダム通話の準備

Expo Go で画面表示 ✅ → いまは **マッチング（相手探し）** まで実装済みです。

## いまできること（Expo Go）

1. **token-server** を PC で起動
2. **mobile/config.js** の IP を PC の IP に変更
3. スマホ2台（または1台＋後からもう1台）で「だれトークする」
4. 「相手を探しています」→「相手が見つかりました」まで確認

※ **音声** はまだ。LiveKit 設定と **開発版アプリ** が必要です。

---

## 手順 A — LiveKit アカウント（無料枠あり）

1. https://cloud.livekit.io でアカウント作成
2. プロジェクトを作成
3. 次をメモ:
   - **API Key**
   - **API Secret**
   - **WebSocket URL**（`wss://xxxx.livekit.cloud`）

---

## 手順 B — token-server の設定

1. フォルダを開く: `growth-app\token-server`
2. `.env.example` をコピーして `.env` という名前にする
3. `.env` に LiveKit のキーを貼り付け

```
LIVEKIT_API_KEY=（あなたのキー）
LIVEKIT_API_SECRET=（あなたのシークレット）
LIVEKIT_URL=wss://（あなたのURL）
PORT=3001
```

4. **`起動.bat`** をダブルクリック  
   → `LiveKit configured: true` と出れば OK

---

## 手順 C — アプリの IP 設定

`growth-app\mobile\config.js` を開き、PC の IP に変更:

```javascript
export const TOKEN_SERVER = 'http://192.168.1.5:3001';
```

（`192.168.1.5` は例。QRで起動.bat に出る IP と同じ）

---

## 手順 D — マッチングのテスト

1. PC: `token-server\起動.bat` を起動したままにする
2. PC: `mobile\QRで起動.bat` で Expo を起動
3. スマホで Expo Go から接続
4. **だれトークする** をタップ
5. **もう1台のスマホ**（または後から同じ手順）でもう一度 **だれトークする**

→ 「相手が見つかりました」と出ればマッチング成功です。

---

## 次のステップ（音声通話）

LiveKit は **Expo Go では動きません**。開発版アプリが必要です。

### 手順 E — 開発版アプリをビルド

1. `mobile\開発版ビルド.bat` を実行（または EAS CLI でビルド）
2. 初回のみ:
   - `npm install -g eas-cli`
   - `eas login`
   - `eas build:configure`
3. Android 例: `eas build --profile development --platform android`
4. ビルド完了後、スマホに開発版アプリをインストール

### 手順 F — 音声通話テスト

1. PC: `token-server\サーバー起動.bat`（`LiveKit configured: true`）
2. PC: `mobile\QRで起動.bat`
3. **開発版アプリ**（Expo Go ではない）で QR を読み取る
4. スマホ2台で「同意して通話開始」
5. 「通話中」と表示され、声が届けば成功

※ Expo Go ではマッチングまで確認できます。音声接続は開発版のみ。

---

## 実装メモ（2026年5月20日）

- `@livekit/react-native` 等を `mobile/` に追加済み
- `CallScreen` がマッチ後に LiveKit ルームへ接続
- `token-server` の JWT 生成を async 修正済み
- 開発版: `mobile/eas.json` + `開発版ビルド.bat`

---

## 以前の「次のステップ」

## フォルダ

| フォルダ | 役割 |
|----------|------|
| `token-server/` | マッチング + LiveKit トークン発行 |
| `mobile/` | アプリ本体 |
