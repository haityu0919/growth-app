# LiveKit 登録後 — 設定のしかた（画面の流れ）

プログラムがわからなくても、**コピーと貼り付け**だけで進められます。  
**API キーはチャット（Cursor）に貼らない**でください。PC の `.env` だけに書きます。

---

## 全体の流れ（5ステップ）

```
① LiveKit のサイトで 3つコピー
        ↓
② PC に .env ファイルを作って貼り付け
        ↓
③ アプリの config.js に PC の IP を書く
        ↓
④ 黒い画面を2つ起動（サーバー + Expo）
        ↓
⑤ スマホで「だれトークする」を試す
```

---

## ① LiveKit から 3つコピーする

1. ブラウザで **https://cloud.livekit.io** を開く（ログイン）
2. 左メニューまたはホームから **「Settings」** または **「プロジェクト設定」** を開く  
   （英語画面なら **Settings → Keys** や **Project → Settings**）
3. 次の **3つ** をメモ帳にコピー（どこかに貼っておく）

| 名前 | 例 | 探し方のヒント |
|------|-----|----------------|
| **API Key** | `APIxxxxx` のような文字列 | API Keys の一覧 |
| **API Secret** | 長い英数字 | Key の横の **Show** / **Reveal** で表示（1回だけ見えることあり） |
| **WebSocket URL** | `wss://○○○.livekit.cloud` | Project URL / WebSocket URL / LiveKit URL |

**注意**

- Secret は **他人に見せない**（パスワードと同じ）
- URL は **`wss://` で始まる** もの（`https://` ではない）

---

## ② `.env` ファイルを作る（Windows）

### 2-1. フォルダを開く

エクスプローラーのアドレス欄に貼り付けて Enter:

```
C:\Users\matsuda\Documents\growth-app\token-server
```

### 2-2. ファイルをコピー

1. **`env.example`** または **`.env.example`** というファイルを探す  
   （見えないとき: エクスプローラー上の **「表示」→「隠しファイル」にチェック**）
2. そのファイルを **右クリック** → **コピー**
3. 空白のところで **右クリック** → **貼り付け**
4. コピーされた **`env.example - コピー`** を **右クリック** → **名前の変更**
5. 名前を **`.env`** だけにする（**ドット env**、拡張子なし）

**名前を変えられないとき**

- Cursor で `token-server` フォルダを開き、`.env.example` を開いて **名前を付けて保存** → ファイル名を `.env` にする

### 2-3. メモ帳で中身を書き換える

1. **`.env`** を **右クリック** → **プログラムから開く** → **メモ帳**
2. 中身を次の形にする（`your_...` の部分を ① でコピーした値に **置き換え**）

```
LIVEKIT_API_KEY=ここにAPI Keyを貼る
LIVEKIT_API_SECRET=ここにAPI Secretを貼る
LIVEKIT_URL=wss://ここにあなたのURL.livekit.cloud
PORT=3001
```

3. **保存** してメモ帳を閉じる

**例（あなたの値は違います）**

```
LIVEKIT_API_KEY=APIAbCdEfGh
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
LIVEKIT_URL=wss://daretalk-xxxxx.livekit.cloud
PORT=3001
```

### 2-4. 動くか確認

1. 同じフォルダの **`起動.bat`** をダブルクリック
2. 黒い画面に次のように出れば **成功**

```
LiveKit configured: true
```

`false` のときは `.env` のスペルミス・余計な空白・`"` などを確認してください。

---

## ③ アプリ側の IP を書く

1. Cursor またはメモ帳で次を開く:

```
C:\Users\matsuda\Documents\growth-app\mobile\config.js
```

2. 1行目付近を、**あなたの PC の IP** に変える:

```javascript
export const TOKEN_SERVER = 'http://192.168.1.5:3001';
```

**IP の調べ方**

- `QRで起動.bat` の黒い画面に `exp://192.168.x.x:8081` と出る → その **x.x** の部分を使う
- 例: `exp://192.168.0.15:8081` なら → `http://192.168.0.15:3001`

3. 保存

---

## ④ 毎回の起動（2つの黒い画面）

| 順番 | ファイル | 場所 |
|------|----------|------|
| **1** | `起動.bat` | `token-server` フォルダ |
| **2** | `QRで起動.bat` | `mobile` フォルダ |

**両方とも閉じない。** 終わるときだけ × または Ctrl+C。

---

## ⑤ スマホで試す

1. Expo Go でだれトークを開く（いつもどおり QR）
2. **だれトークする** をタップ
3. もう1台のスマホ（または家族のスマホ）でもう一度 **だれトークする**

→ **「相手が見つかりました」** と出れば、LiveKit 設定まで OK です。

---

## よくあるつまずき

| 症状 | 対処 |
|------|------|
| `.env` が見つからない | 隠しファイルを表示 / Cursor で `token-server` を開く |
| `LiveKit configured: false` | `.env` の3行が正しいか、保存したか |
| サーバーに接続できません | `config.js` の IP が PC と同じ Wi-Fi の IP か |
| Secret がわからない | LiveKit の Keys で **新しい Key を作成** して Secret をコピー |

---

## その次（音声で話す）

マッチングまで成功したら、Cursor に **次だけ** 送ってください（キーは貼らない）:

```
LiveKit の .env を設定した。マッチングまでOK。音声通話を進めて
```

こちらで **開発版アプリ**（Expo Go より先の形）の準備をします。
