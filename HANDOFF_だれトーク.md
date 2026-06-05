# だれトーク 開発引き継ぎ（コンパクト版）

最終更新: **2026年6月6日**

---

## 新チャット再開用（コピペ）

```
HANDOFF_だれトーク.md を読んで、だれトークの続きから進めてください。

【状態 2026/6/6】
・ストア画像6枚 保存済み（store-assets/screenshots/）
・Railway コード準備完了（未デプロイ）。経路: CLI=railway-cli-deploy.bat / GitHub=GITHUB_連携のしかた.md
・git init・初回 commit・push は未実施（ユーザー操作）
・Apple Developer 申請済み・承認未着
・音声通話 未テスト

【次の希望を書く】
例）Railway デプロイから（CLI or GitHub）
例）承認後：開発版ビルド→音声テスト
```

Cursor が重いときは新チャット＋上記ブロックのみ。`node_modules`・ストア PNG・`.env` は削除しない。

---

## 現状（2026/6/6）

| 項目 | 状態 |
|------|------|
| Expo Go・マッチング・LiveKit（ローカル） | OK |
| 新アイコン・起動画面 | 反映済み |
| ストア掲載画像 6枚 | **保存済み** |
| ストア説明文・FAQ・プライバシー HTML | 下書き済み |
| 音声通話 | **未テスト** |
| Apple Developer | 申請済み・**承認未着** |
| Railway 本番 | **コード準備完了**・**デプロイ未実施** |
| Git / GitHub | **連携準備済み**・**`git init`/push 未実施** |

**開発起動:** `token-server\サーバー起動.bat` → `mobile\start-expo-qr.bat`  
**サーバー URL:** `mobile\.env` の `EXPO_PUBLIC_TOKEN_SERVER`（空なら `192.168.0.245:3001`）

---

## Railway デプロイ（2経路）

| 経路 | 入口 |
|------|------|
| **CLI**（推奨・今すぐ） | `token-server\railway-cli-deploy.bat` |
| **GitHub** | `GITHUB_連携のしかた.md` |

準備済み: `railway.toml` / `railway.json` / `Procfile` / `/health` / `PORT` / `.gitignore`  
デプロイ後: `railway-deploy-check.bat` → `mobile\.env` に `EXPO_PUBLIC_TOKEN_SERVER=https://...`  
詳細: `token-server/RAILWAY_デプロイのしかた.md`

**GitHub 経路（ユーザー操作）:** `git init` → commit → GitHub 作成 → push → Railway Root Directory = `token-server`

---

## ストア画像（保存済み）

`store-01-hero-voice` → `store-02-random-call` → `store-04-anonymous-voice` → `store-05-kumorin-waiting` → `store-03-safety` ＋ `play-feature-graphic.png`  
掲載順・文案: `mobile/store-assets/ストア掲載画像一覧.md`（提出前にアプリ名目視確認）

---

## 次にやること

**Apple 承認前:** (1) ストア画像目視 (2) Railway デプロイ (3) `/health`→`.env` (4) プライバシー Web 公開 `docs/privacy-policy/` (5) ストア説明 `STORE_LISTING.md`

**承認後:** (1) `eas login`→`start-dev-build.bat` (2) 2台で音声テスト (3) 通報・ブロック・10代注意 (4) TestFlight→申請

---

## 重要ファイル

| ファイル | 用途 |
|----------|------|
| `GITHUB_連携のしかた.md` | **GitHub 経路の入口** |
| `token-server/RAILWAY_デプロイのしかた.md` | Railway 全般 |
| `token-server/railway-cli-deploy.bat` | CLI デプロイ |
| `TEAM_REPORT_2026-06-06.md` | 本日セッション |
| `mobile/store-assets/ストア掲載画像一覧.md` | ストア画像確定版 |
| `mobile/音声テストのしかた.txt` | 音声テスト手順 |
