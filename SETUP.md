# だれトーク — 環境づくり・動かし方

プログラム経験がなくても、AI（Cursor）と Expo Go で開発・確認できます。

## フォルダ構成

```
growth-app/
├── README.md          … 企画・仕様・チーム
├── SETUP.md           … このファイル（環境・起動手順）
└── mobile/            … アプリのコード（Expo）
    ├── App.js         … メイン画面
    ├── app.json       … アプリ設定
    └── package.json   … 依存関係
```

## 1. PC 側（済み）

| 項目 | 状態 |
|------|------|
| Node.js | `C:\Program Files\nodejs\`（v24） |
| Expo プロジェクト | `mobile\` に作成済み |

**注意:** Cursor 内蔵の `node` には `npm` がありません。ターミナルでコマンドを打つときは、下記の **PATH を先に設定** するか、フルパスを使ってください。

```powershell
$env:Path = "$env:ProgramFiles\nodejs;" + $env:Path
```

## 2. スマホ側（あなたがやること）

1. **Expo Go** をインストール  
   - iPhone: [App Store — Expo Go](https://apps.apple.com/app/expo-go/id982107779)  
   - Android: [Google Play — Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. PC とスマホを **同じ Wi‑Fi** に接続する

## 3. アプリを起動する（毎回）

### 手順 A — いちばん簡単（おすすめ）

エクスプローラーで次のファイルを **ダブルクリック**:

```
C:\Users\matsuda\Documents\growth-app\mobile\起動.bat
```

黒い画面が開き、QR コードやメニューが出れば成功です。終わるときはその画面で `Ctrl + C`。

**スマホ用（トンネル）:** 同じフォルダの `start-app-tunnel.ps1` を右クリック → **PowerShell で実行**

### 手順 B — Cursor のターミナル

```powershell
$env:Path = "$env:ProgramFiles\nodejs;" + $env:Path
cd C:\Users\matsuda\Documents\growth-app\mobile
npm start
```

`npx` や `npm` が見つからないときは、**手順 A の `起動.bat`** を使ってください（PATH を自動で直します）。

**ポート 8081 が使用中** と出たとき:

```powershell
npx expo start --port 8082
```

または PC を再起動してから `起動.bat` を再度実行。

### 手順 B — まず PC のブラウザで確認（いちばん簡単）

1. 上記 `npm start` のあと、ターミナルがメニュー画面になるまで待つ  
2. キーボードで **`w`** を1回押す  
3. ブラウザに「だれトーク」の画面が出れば、アプリ自体は正常です  

→ ここで表示できれば、あとは **スマホとの接続だけ** の問題です。

### 手順 C — スマホ（Expo Go）で見る

**おすすめ: トンネル接続**（Wi‑Fi が違ってもつながりやすい）

```powershell
$env:Path = "$env:ProgramFiles\nodejs;" + $env:Path
cd C:\Users\matsuda\Documents\growth-app\mobile
npx expo start --tunnel
```

初回は少し時間がかかります。QR コードが出たら:

- **iPhone:** カメラで QR → 「Expo Go で開く」  
- **Android:** Expo Go アプリ → 「Scan QR code」

**通常接続（同じ Wi‑Fi のとき）**

`npm start` の QR のまま読み取る。  
※ 会社・学校の Wi‑Fi ではつながらないことがあります。そのときは **手順 C のトンネル** を使ってください。

### 手順 D — Expo Go のバージョン

App Store / Google Play で **Expo Go を最新に更新** してください（このプロジェクトは Expo SDK 54 です）。

## 4. うまくいかないとき

| 症状 | 対処 |
|------|------|
| `npm` が見つからない | `$env:Path = "$env:ProgramFiles\nodejs;" + $env:Path` を先に実行 |
| QR でずっと読み込み | `npx expo start --tunnel` で再試行 |
| 「Something went wrong」 | ターミナルの赤いエラーをコピーして Cursor に貼る |
| ブラウザ（`w`）も出ない | ターミナル全文を Cursor に貼る |
| 会社・公衆 Wi‑Fi | トンネル接続を使う。またはスマホのテザリングで PC とスマホを同じ回線に |
| ファイアウォール | Windows の「プライベートネットワーク」で Node.js を許可 |

## 5. これから AI が追加するもの

- LiveKit（通話・ラジオ）
- Supabase（ユーザー・データ）
- 通報・安全機能

アカウント作成が必要になったら、AI が手順を案内します。
