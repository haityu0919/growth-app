# DareTalk token-server - Railway /health check
# Usage:
#   .\railway-deploy-check.ps1
#   .\railway-deploy-check.ps1 -Url "https://your-app.up.railway.app"
param(
    [string]$Url = $env:EXPO_PUBLIC_TOKEN_SERVER
)

$ErrorActionPreference = 'Stop'

if (-not $Url -or $Url.Trim() -eq '') {
    Write-Host ''
    Write-Host 'URL が未指定です。' -ForegroundColor Red
    Write-Host '  .\railway-deploy-check.ps1 -Url "https://your-app.up.railway.app"'
    Write-Host '  または環境変数 EXPO_PUBLIC_TOKEN_SERVER を設定してください。'
    Write-Host ''
    exit 1
}

$Url = $Url.Trim().TrimEnd('/')
$healthUrl = "$Url/health"

Write-Host ''
Write-Host '========================================'
Write-Host '  DareTalk - Railway Health Check'
Write-Host '========================================'
Write-Host "  GET $healthUrl"
Write-Host ''

try {
    $response = Invoke-RestMethod -Uri $healthUrl -Method GET -TimeoutSec 15
    $ok = [bool]$response.ok
    $livekit = [bool]$response.livekitConfigured

    if ($ok) {
        Write-Host '  OK - /health responded' -ForegroundColor Green
    } else {
        Write-Host '  NG - ok is not true' -ForegroundColor Red
        exit 1
    }

    if ($livekit) {
        Write-Host '  OK - livekitConfigured: true' -ForegroundColor Green
    } else {
        Write-Host '  WARN - livekitConfigured: false' -ForegroundColor Yellow
        Write-Host '  Railway Variables に LIVEKIT_URL / LIVEKIT_API_KEY / LIVEKIT_API_SECRET を設定してください。'
    }

    Write-Host ''
    Write-Host 'Response:'
    Write-Host ($response | ConvertTo-Json -Compress)
    Write-Host ''
    exit 0
} catch {
    Write-Host "  NG - request failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ''
    Write-Host '確認事項:'
    Write-Host '  - Railway でデプロイが成功しているか'
    Write-Host '  - Settings → Networking で Public Domain を生成したか'
    Write-Host '  - URL の末尾にスラッシュを付けていないか'
    Write-Host ''
    exit 1
}
