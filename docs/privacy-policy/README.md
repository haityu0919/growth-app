# プライバシーポリシーを Web 公開する

## GitHub Pages（無料・おすすめ）

1. GitHub に `growth-app` リポジトリを作成（または既存を使用）
2. リポジトリの **Settings → Pages**
3. **Source:** Deploy from a branch
4. **Branch:** `main` / フォルダ: `/docs`
5. 保存後、数分で URL が発行される  
   例: `https://あなたのユーザー名.github.io/growth-app/privacy-policy/`

## ストアに記載する URL

App Store Connect / Google Play の「プライバシーポリシー URL」欄に、上記 URL を貼る。

## アプリ内との同期

本文は `mobile/screens/PrivacyPolicyScreen.js` と揃えています。  
更新時は **HTML とアプリの両方** を直してください。

## 公開前チェック

- [ ] URL がスマホのブラウザで開ける
- [ ] 問い合わせメールが正しい
- [ ] 最終更新日が最新
