@echo off
chcp 65001 >nul
title DareTalk - Railway CLI Deploy
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"

echo.
echo ============================================================
echo  だれトーク token-server - Railway CLI デプロイ（対話式）
echo ============================================================
echo.
echo GitHub リポジトリがなくても、この手順でデプロイできます。
echo.
echo ※ GitHub に push 済みなら、ダッシュボードの「Deploy from GitHub repo」も使えます。
echo   手順: プロジェクト直下の GITHUB_連携のしかた.md（Root Directory = token-server）
echo.
echo 各ステップの説明のあと Enter で進みます。
echo.
pause

echo.
echo [確認] growth-app が Git リポジトリかどうか
echo   cd c:\Users\matsuda\Documents\growth-app
echo   git status
echo   git remote -v
echo.
echo "not a git repository" や remote が空なら、先に GITHUB_連携のしかた.md で
echo git init / push するか、このバッチの CLI 手順で進めてください。
echo.
pause

echo.
echo [ステップ 1/7] Railway CLI のインストール（初回のみ）
echo.
echo 次のコマンドを実行します:
echo   npm i -g @railway/cli
echo.
set /p DO_INSTALL="実行する? (Y/n): "
if /i not "%DO_INSTALL%"=="n" (
    call npm i -g @railway/cli
    if errorlevel 1 (
        echo.
        echo ERROR: CLI のインストールに失敗しました。Node.js が入っているか確認してください。
        pause
        exit /b 1
    )
)
echo.
pause

echo.
echo [ステップ 2/7] Railway にログイン
echo.
echo 次のコマンドを実行します（ブラウザが開きます）:
echo   railway login
echo.
echo ブラウザで Railway アカウントにログインし、ターミナルに戻ってください。
echo.
pause
call railway login
if errorlevel 1 (
    echo.
    echo ERROR: ログインに失敗しました。もう一度 railway login を試してください。
    pause
    exit /b 1
)
echo.
pause

echo.
echo [ステップ 3/7] プロジェクトの作成・リンク（初回のみ）
echo.
echo 現在のフォルダ: %CD%
echo 次のコマンドを実行します:
echo   railway init
echo.
echo プロジェクト名を聞かれたら daretalk など好きな名前で OK です。
echo.
pause
call railway init
if errorlevel 1 (
    echo.
    echo ERROR: railway init に失敗しました。
    pause
    exit /b 1
)
echo.
pause

echo.
echo [ステップ 4/7] 環境変数の設定
echo.
if not exist "%~dp0.env" (
    echo WARNING: .env が見つかりません。
    echo .env.example をコピーして LiveKit の値を入れてから、変数を設定してください。
    echo.
) else (
    echo token-server\.env を開き、次の 3 つをコピーしておいてください:
    echo   LIVEKIT_URL
    echo   LIVEKIT_API_KEY
    echo   LIVEKIT_API_SECRET
    echo.
)
echo 次のコマンドを 1 行ずつ実行します（値は .env から貼り付け）:
echo   railway variables set LIVEKIT_URL="wss://xxxx.livekit.cloud"
echo   railway variables set LIVEKIT_API_KEY="（.env の値）"
echo   railway variables set LIVEKIT_API_SECRET="（.env の値）"
echo.
echo PORT は Railway が自動設定するため不要です。
echo.
pause

set /p LIVEKIT_URL_VAL="LIVEKIT_URL の値を入力: "
if not "%LIVEKIT_URL_VAL%"=="" (
    call railway variables set LIVEKIT_URL="%LIVEKIT_URL_VAL%"
)
set /p LIVEKIT_KEY_VAL="LIVEKIT_API_KEY の値を入力: "
if not "%LIVEKIT_KEY_VAL%"=="" (
    call railway variables set LIVEKIT_API_KEY="%LIVEKIT_KEY_VAL%"
)
set /p LIVEKIT_SECRET_VAL="LIVEKIT_API_SECRET の値を入力: "
if not "%LIVEKIT_SECRET_VAL%"=="" (
    call railway variables set LIVEKIT_API_SECRET="%LIVEKIT_SECRET_VAL%"
)
echo.
pause

echo.
echo [ステップ 5/7] デプロイ
echo.
echo 次のコマンドを実行します:
echo   railway up
echo.
echo ビルドとデプロイに数分かかることがあります。
echo.
pause
call railway up
if errorlevel 1 (
    echo.
    echo ERROR: デプロイに失敗しました。ログを確認してください。
    pause
    exit /b 1
)
echo.
pause

echo.
echo [ステップ 6/7] 公開ドメインの取得
echo.
echo 次のコマンドを実行します:
echo   railway domain
echo.
pause
call railway domain
echo.
pause

echo.
echo [ステップ 7/7] 動作確認
echo.
echo 表示された URL の末尾に /health を付けてブラウザで開きます。
echo 例: https://xxxx.up.railway.app/health
echo.
echo または:
echo   railway-deploy-check.bat -Url "https://xxxx.up.railway.app"
echo.
echo 成功時: { "ok": true, "livekitConfigured": true }
echo.
echo 次: mobile\.env に次を追加（Expo 再起動）:
echo   EXPO_PUBLIC_TOKEN_SERVER=https://xxxx.up.railway.app
echo.
echo 詳細: RAILWAY_デプロイのしかた.md
echo.
pause
