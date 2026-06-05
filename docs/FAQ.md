# だれトーク FAQ（Expo Go と開発版）

## Q1. Expo Go と開発版（dev client）の違いは？

| | **Expo Go** | **開発版アプリ** |
|--|-------------|----------------|
| インストール | App Store の「Expo Go」 | EAS でビルドした「だれトーク」専用アプリ |
| 起動 | `start-expo-qr.bat` → QR（**Expo Go アプリ内**で読む） | インストールしたアプリをタップ |
| できること | 画面表示・マッチング・通報 UI など | **音声通話（LiveKit）** まで含む |
| できないこと | **音声通話** | — |
| 費用 | 無料 | Apple Developer（iOS・年 $99）など |

**まとめ:** UI とマッチングの確認は Expo Go。音声の実機テストは開発版が必須。

---

## Q2. 「相手が見つかりました」と出るのに音が出ない

Expo Go では **マッチングまで** で止まります。音声は開発版でテストしてください。  
`mobile/音声テストのしかた.txt` を参照。

---

## Q3. マッチングできない・サーバーに繋がらない

1. PC で `token-server\サーバー起動.bat` を実行しているか  
2. iPhone と PC が **同じ Wi-Fi** か（トンネルはアプリ読込のみでマッチングには使えない）  
3. `mobile/config.js` の URL が PC の IP と一致しているか  
4. クラウド利用時は `.env` の `EXPO_PUBLIC_TOKEN_SERVER` が Railway の URL か  

---

## Q4. QR コードが読めない（iPhone カメラ）

**iPhone のカメラではなく、Expo Go アプリを開いてから** QR を読んでください。  
`mobile/接続のしかた.txt` / `start-expo-recovery.bat` も参照。

---

## Q5. クラウドサーバーとローカル PC の切り替え

- **ローカル:** `.env` を空または削除 → デフォルト `192.168.0.245:3001`  
- **Railway:** `mobile/.env` に `EXPO_PUBLIC_TOKEN_SERVER=https://...` を設定 → Expo 再起動  

手順: `token-server/RAILWAY_デプロイのしかた.md`

---

## Q6. TestFlight はいつ使える？

**Apple Developer Program の承認後** に、EAS ビルド → App Store Connect 提出 → TestFlight 配布が可能です。

---

問い合わせ: アプリ内「問い合わせ」または haityu09191213@gmail.com
