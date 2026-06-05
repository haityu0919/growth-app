# token-server を Railway にデプロイする

だれトークのマッチング API（`token-server`）を Railway に公開し、実機・TestFlight から使えるようにする手順です。

**コード側の準備は完了済み**（`railway.toml` / `railway.json` / `Procfile` / `/health`）。あとは Railway ダッシュボードでの操作と、モバイル側の URL 設定が必要です。

---

## 「リポジトリが見つかりません」対処法

Railway の **New Project → Deploy from GitHub repo**（ステップ 2）で **repository not found** / **リポジトリが見つかりません** と出る場合、**ローカルの `growth-app` が Git リポジトリではない**、または **GitHub に push されていない**ことが原因です。

確認（PowerShell）:

```powershell
cd c:\Users\matsuda\Documents\growth-app
git status        # → "not a git repository" なら Git 未初期化
git remote -v     # → 何も出なければ GitHub 未接続
Test-Path .git    # → False なら .git フォルダなし
```

**いまの状態（2026/6/6）:** ルート `.gitignore` と `GITHUB_連携のしかた.md` で GitHub 連携の準備済み。`git init`・push はユーザー操作。**push 前は経路 A（CLI）、push 後は経路 B（GitHub）も可**です。

### 経路 A: GitHub なし（おすすめ・今すぐ）— Empty Project → Railway CLI

GitHub に上げずに、PC から直接 `token-server` をデプロイします。

**対話式バッチ（初心者向け）:** `token-server\railway-cli-deploy.bat` をダブルクリック。各ステップでコマンドを表示し、Enter で進みます（`railway login` だけはブラウザ認証が必要）。

**手動でやる場合（コピペ用）:**

```powershell
# 1) CLI インストール（初回のみ）
npm i -g @railway/cli

# 2) ログイン（ブラウザが開く）
railway login

# 3) token-server フォルダへ
cd c:\Users\matsuda\Documents\growth-app\token-server

# 4) 新規プロジェクト作成・リンク（初回のみ。プロジェクト名を聞かれたら daretalk など）
railway init

# 5) 環境変数（値は token-server\.env からコピー。秘密情報は他人に見せない）
railway variables set LIVEKIT_URL="wss://xxxx.livekit.cloud"
railway variables set LIVEKIT_API_KEY="（.env の値）"
railway variables set LIVEKIT_API_SECRET="（.env の値）"

# 6) デプロイ
railway up

# 7) 公開 URL 取得
railway domain
```

デプロイ後: `railway-deploy-check.bat -Url "https://あなたのドメイン.up.railway.app"` で `/health` を確認 → 下記「モバイルアプリに URL を設定」へ。

**Railway ダッシュボード側:** New Project で **Empty Project** を選べば OK（GitHub 連携は不要）。

### 経路 B: GitHub 経由（push 後の自動デプロイ向け）

**詳細手順:** プロジェクト直下の **`GITHUB_連携のしかた.md`** を参照（秘密情報の確認・`gh repo create` 例付き）。

1. `git init` → 初回 commit → GitHub リポジトリ作成 → push
2. Railway: **New Project → Deploy from GitHub repo** → 作成したリポジトリを選択
4. サービス設定で **Root Directory** = `token-server`（monorepo のため必須）
5. Variables 設定 → デプロイ → Generate Domain（以降は下記「方法 A: Railway ダッシュボード」参照）

**注意:** `.env` や `data/*.json` は `.gitignore` 済み。秘密情報は Git に入れないこと。

---

## 事前準備（ローカル）

1. **LiveKit の認証情報**を手元に用意する  
   - ローカルの `token-server/.env` を開き、次の 3 つをコピーする（**このファイルは Git にコミットしない**）
   - `LIVEKIT_URL`（例: `wss://xxxx.livekit.cloud`）
   - `LIVEKIT_API_KEY`
   - `LIVEKIT_API_SECRET`
2. ローカルで動作確認済みならスキップ可。未確認の場合:
   ```bat
   cd token-server
   サーバー起動.bat
   ```
   ブラウザで `http://127.0.0.1:3001/health` → `{ "ok": true, "livekitConfigured": true }`

---

## 方法 A: Railway ダッシュボード（推奨・初回向け）

### 1. アカウントとプロジェクト

1. https://railway.app にアクセスし、GitHub またはメールで **ログイン**
2. **New Project** をクリック
3. 次のいずれかを選ぶ:
   - **Deploy from GitHub repo** … `growth-app` リポジトリを接続（後述の Root Directory を設定）
   - **Empty Project** … 後から GitHub 連携または CLI でデプロイ

### 2. サービス設定（monorepo の場合）

リポジトリ全体をデプロイする場合:

| 項目 | 値 |
|------|-----|
| **Root Directory** | `token-server` |
| **Watch Paths**（任意） | `token-server/**` |

単体フォルダだけをデプロイする場合は Root Directory は空のままで OK。

### 3. 環境変数（Variables）

サービス → **Variables** タブで次を追加する。**値はローカル `.env` からコピー**（秘密情報はドキュメントや Git に載せない）。

| 名前 | 説明 | 例 |
|------|------|-----|
| `LIVEKIT_URL` | LiveKit Cloud の WebSocket URL | `wss://xxxx.livekit.cloud` |
| `LIVEKIT_API_KEY` | LiveKit API Key | （`.env` からコピー） |
| `LIVEKIT_API_SECRET` | LiveKit API Secret | （`.env` からコピー） |
| `PORT` | **設定不要** | Railway が自動注入 |

`PORT` は `index.js` が `process.env.PORT` を読むため、Railway 側の値がそのまま使われます。

### 4. デプロイ

- **Build**: Nixpacks（`railway.toml` / `railway.json` 参照）
- **Start**: `npm start` → `node index.js`
- **Healthcheck**: `GET /health`（デプロイ成功の判定に使用）

デプロイログで `DareTalk token server: http://0.0.0.0:...` と `LiveKit configured: true` が出れば成功。

### 5. 公開ドメイン（Networking）

1. サービス → **Settings** → **Networking**
2. **Generate Domain** をクリック
3. 表示された URL をメモ（例: `https://daretalk-production.up.railway.app`）  
   **末尾にスラッシュは付けない**

### 6. 動作確認

**ブラウザ**

```
https://あなたのドメイン.up.railway.app/health
```

期待レスポンス:

```json
{ "ok": true, "livekitConfigured": true }
```

`livekitConfigured` が `false` のときは Variables の 3 つ（LiveKit）を再確認し、**Redeploy** する。

**スクリプト（Windows）**

```bat
cd token-server
railway-deploy-check.bat -Url "https://あなたのドメイン.up.railway.app"
```

または `mobile\.env` に URL を入れたあと:

```bat
railway-deploy-check.bat
```

---

## 方法 B: Railway CLI

CLI が未インストールの場合:

```powershell
npm i -g @railway/cli
railway login
```

`token-server` フォルダで:

```powershell
cd c:\Users\matsuda\Documents\growth-app\token-server
railway init          # 新規プロジェクトにリンク（初回のみ）
railway variables set LIVEKIT_URL="wss://xxxx.livekit.cloud"
railway variables set LIVEKIT_API_KEY="（.env から）"
railway variables set LIVEKIT_API_SECRET="（.env から）"
railway up              # フォルダ内容をデプロイ
railway domain          # 公開ドメイン生成（またはダッシュボードで Generate Domain）
```

デプロイ後:

```powershell
.\railway-deploy-check.ps1 -Url "https://あなたのドメイン.up.railway.app"
```

---

## モバイルアプリに URL を設定

Railway の公開 URL を `mobile/.env` に書く（**コミットしない**）:

```env
EXPO_PUBLIC_TOKEN_SERVER=https://あなたのドメイン.up.railway.app
```

`mobile/config.js` と `mobile/app.config.js` はこの値を読み込む。設定後は **Expo を再起動**（`mobile\start-expo-qr.bat` など）。

| 環境 | TOKEN_SERVER の出どころ |
|------|-------------------------|
| 自宅・同一 Wi‑Fi 開発 | 空のまま → `config.js` のローカル IP（`192.168.x.x:3001`） |
| 実機・外出先・TestFlight | `EXPO_PUBLIC_TOKEN_SERVER` = Railway URL |

---

## data/ ディレクトリについて

通報・ブロック・問い合わせは `token-server/data/*.json` に保存されます。

| 環境 | 挙動 |
|------|------|
| ローカル | `data/` は自動作成。`data/*.json` は `.gitignore` 対象（コミットしない） |
| Railway | コンテナのローカルディスクに保存。**再デプロイ・スケールで消える**ことがある |

本番で永続化が必要になったら Supabase 等への移行を検討（HANDOFF 参照）。

---

## トラブルシュート

| 症状 | 対処 |
|------|------|
| デプロイは成功するが `/health` が開けない | Networking で **Generate Domain** 済みか確認 |
| `livekitConfigured: false` | Variables の 3 キーを確認 → Redeploy |
| 502 / Application failed to respond | ログで `npm start` エラー確認。`node_modules` は Nixpacks が自動インストール |
| モバイルが API に届かない | `mobile/.env` の URL・Expo 再起動・末尾スラッシュなし |
| 再デプロイ後に通報が消えた | Railway のエフェメラルストレージ仕様（上記 data/ 参照） |

---

## ファイル一覧（デプロイ関連）

| ファイル | 役割 |
|----------|------|
| `railway.toml` | Nixpacks ビルド・start・healthcheck |
| `railway.json` | Railway 設定（JSON 形式・同上） |
| `Procfile` | `web: npm start`（互換用） |
| `package.json` | `npm start`、Node >= 18 |
| `index.js` | `PORT`・`/health`・API |
| `.env.example` | ローカル用テンプレ（秘密情報なし） |
| `railway-cli-deploy.bat` | CLI 対話デプロイ（GitHub 不要） |
| `railway-deploy-check.ps1` / `.bat` | 本番 `/health` 確認 |

---

## チェックリスト

- [ ] Railway にログインしプロジェクト作成
- [ ] Root Directory = `token-server`（monorepo の場合）
- [ ] Variables: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
- [ ] デプロイ成功（ログに `LiveKit configured: true`）
- [ ] **Generate Domain** で公開 URL 取得
- [ ] `/health` が `ok: true` かつ `livekitConfigured: true`
- [ ] `mobile/.env` に `EXPO_PUBLIC_TOKEN_SERVER` 設定
- [ ] Expo 再起動後、実機でマッチング動作確認
