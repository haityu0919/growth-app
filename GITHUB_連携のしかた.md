# GitHub 連携のしかた（だれトーク growth-app）

> **Railway デプロイ — GitHub 経路の入口ドキュメント**  
> CLI で今すぐデプロイする場合は `token-server\railway-cli-deploy.bat`（`HANDOFF_だれトーク.md` 参照）。

`growth-app` を GitHub に push し、Railway の **Deploy from GitHub repo** で `token-server` を本番デプロイする手順です。
**2026/6/6 時点:** ルート `.gitignore`・`token-server/data/.gitkeep`・本ドキュメントを用意済み。  
**まだやっていないこと:** `git init`・初回コミット・GitHub リポジトリ作成・push（ユーザー操作）。

---

## コミットしてはいけないもの

| パス | 理由 |
|------|------|
| `token-server/.env` | LiveKit の秘密鍵 |
| `mobile/.env` | 本番 URL 等 |
| `node_modules/` | 依存パッケージ（再インストール可） |
| `token-server/data/*.json` | 通報・ブロック等の実データ |

`.gitignore` で除外済みです。コミット前に必ず確認してください。

```powershell
cd c:\Users\matsuda\Documents\growth-app
git status
```

`token-server/.env` や `mobile/.env` が **Untracked** に出ても OK（無視されている）。  
**Staged** に出たら `git reset HEAD <ファイル>` で外し、`.gitignore` を見直してください。

---

## 事前確認（git / gh）

PowerShell で:

```powershell
git --version          # 例: git version 2.x
gh --version           # 未インストールなら https://cli.github.com
gh auth status         # ログイン済みなら "Logged in to github.com"
```

`gh` が使えない場合は、ブラウザで [github.com/new](https://github.com/new) からリポジトリを作成してください。

---

## ステップ 1: Git 初期化（初回のみ）

```powershell
cd c:\Users\matsuda\Documents\growth-app

# まだ .git がなければ
git init

# 確認
git status
```

`not a git repository` と出たら、上の `git init` を実行してください。

---

## ステップ 2: 初回コミット

```powershell
cd c:\Users\matsuda\Documents\growth-app

git add .
git status
```

**確認ポイント（ステージに入っていないこと）:**

- `token-server/.env`
- `mobile/.env`
- `node_modules/`
- `token-server/data/reports.json` など `data/*.json`

問題なければ:

```powershell
git commit -m "Initial commit: DareTalk growth-app"
git branch -M main
```

---

## ステップ 3: GitHub にリポジトリを作成

### 方法 A: ブラウザ（誰でも可）

1. [https://github.com/new](https://github.com/new) を開く
2. Repository name: 例 `growth-app`
3. **Private** を推奨（LiveKit 設定やアプリ資産を含むため）
4. **Add a README** はオフ（ローカルに README あり）
5. **Create repository**

作成後に表示される URL をメモ:

```
https://github.com/あなたのユーザー名/growth-app.git
```

### 方法 B: GitHub CLI（`gh auth status` が成功している場合）

**自動作成はしません。** 次のコマンドを自分で実行してください:

```powershell
cd c:\Users\matsuda\Documents\growth-app

gh repo create growth-app --private --source=. --remote=origin --push
```

- リポジトリ名を変えたい場合は `growth-app` を変更
- 公開リポジトリにする場合は `--public`
- すでに `git remote add` 済みの場合は `--push` だけ別途 `git push -u origin main`

---

## ステップ 4: リモート追加と push（方法 A で作った場合）

```powershell
cd c:\Users\matsuda\Documents\growth-app

git remote add origin https://github.com/あなたのユーザー名/growth-app.git
git push -u origin main
```

SSH を使う場合:

```powershell
git remote add origin git@github.com:あなたのユーザー名/growth-app.git
git push -u origin main
```

---

## ステップ 5: Railway で GitHub 連携デプロイ

1. [https://railway.app](https://railway.app) にログイン
2. **New Project** → **Deploy from GitHub repo**
3. 作成した `growth-app` リポジトリを選択
4. サービス設定で次を設定:

| 項目 | 値 |
|------|-----|
| **Root Directory** | `token-server` |
| **Watch Paths**（任意） | `token-server/**` |

**Root Directory を忘れると monorepo 全体がデプロイされ失敗します。必ず `token-server` に設定してください。**

5. サービス → **Variables** で環境変数を追加（値はローカル `token-server/.env` からコピー。**Git に載せない**）

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `LIVEKIT_URL` | LiveKit Cloud の WebSocket URL | `wss://xxxx.livekit.cloud` |
| `LIVEKIT_API_KEY` | LiveKit API Key | （`.env` からコピー） |
| `LIVEKIT_API_SECRET` | LiveKit API Secret | （`.env` からコピー） |
| `PORT` | **設定不要** | Railway が自動注入 |

6. **Settings** → **Networking** → **Generate Domain** で公開 URL を取得
7. ブラウザで `https://あなたのドメイン.up.railway.app/health` を開く

期待レスポンス:

```json
{ "ok": true, "livekitConfigured": true }
```

または:

```bat
cd token-server
railway-deploy-check.bat -Url "https://あなたのドメイン.up.railway.app"
```

---

## ステップ 6: モバイルアプリに本番 URL を設定

`mobile/.env`（**コミットしない**）:

```env
EXPO_PUBLIC_TOKEN_SERVER=https://あなたのドメイン.up.railway.app
```

設定後、Expo を再起動（`mobile\start-expo-qr.bat` など）。

---

## デプロイ経路の選び方

| 経路 | いつ使うか |
|------|------------|
| **GitHub 連携**（本ドキュメント） | push のたびに自動デプロイしたい。チーム開発・CI/CD 向け |
| **CLI デプロイ** | GitHub なしで今すぐデプロイ。`token-server\railway-cli-deploy.bat` |

GitHub に push 済みなら、Railway ダッシュボードの GitHub 連携が使えます。  
詳細は `token-server/RAILWAY_デプロイのしかた.md` の「経路 B」も参照。

---

## トラブルシュート

| 症状 | 対処 |
|------|------|
| Railway で「リポジトリが見つかりません」 | `git push` 済みか、Railway に GitHub アクセス権があるか確認 |
| `.env` がコミットされそう | `git status` で確認。ステージされていたら `git reset HEAD` |
| デプロイ成功だが `/health` が失敗 | Variables の LiveKit 3 つを確認 → Redeploy |
| ビルドが mobile 側で失敗 | Root Directory = `token-server` か再確認 |

---

## 関連ファイル

| ファイル | 用途 |
|----------|------|
| `.gitignore` | 秘密情報・生成物の除外 |
| `token-server/railway.toml` | Railway ビルド・ヘルスチェック |
| `token-server/RAILWAY_デプロイのしかた.md` | Railway 全般（CLI 含む） |
| `token-server/railway-cli-deploy.bat` | GitHub 不要の CLI デプロイ |
| `HANDOFF_だれトーク.md` | プロジェクト全体の引き継ぎ |
