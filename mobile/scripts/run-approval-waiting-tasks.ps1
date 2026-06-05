# Apple 承認待ちタスク 1〜7 を一括実行
$ErrorActionPreference = 'Continue'
$mobile = Split-Path $PSScriptRoot -Parent
Set-Location $mobile
$log = Join-Path $mobile 'approval-waiting-log.txt'
$script:lines = @("=== approval waiting tasks $(Get-Date -Format 'yyyy-MM-dd HH:mm') ===")

function Log($msg) { $script:lines += $msg; Write-Host $msg }

Log '[1] apply-brand-assets'
node scripts\apply-brand-assets.cjs 2>&1 | ForEach-Object { Log $_ }

Log '[1b] optimize-pngs'
npm install --no-save sharp 2>$null | Out-Null
if (Test-Path node_modules\sharp) {
  node scripts\optimize-pngs.cjs 2>&1 | ForEach-Object { Log $_ }
  npm uninstall sharp 2>$null | Out-Null
  Remove-Item -Recurse -Force node_modules\sharp, node_modules\@img\sharp-win32-x64 -ErrorAction SilentlyContinue
} else {
  & powershell -NoProfile -ExecutionPolicy Bypass -File scripts\optimize-pngs.ps1 2>&1 | ForEach-Object { Log $_ }
}

Log '[2] copy-store-screenshots'
node scripts\copy-store-screenshots.cjs 2>&1 | ForEach-Object { Log $_ }

Log '[3-4] Railway: see token-server\RAILWAY_デプロイのしかた.md (manual deploy)'
Log '[5] STORE_LISTING.md written'
Log '[6] docs\privacy-policy\index.html + README'
Log '[7] docs\FAQ.md written'

if (-not (Test-Path .env) -and (Test-Path .env.example)) {
  Copy-Item .env.example .env
  Log 'Created mobile/.env from .env.example (set EXPO_PUBLIC_TOKEN_SERVER after Railway)'
}

$script:lines += 'DONE'
$script:lines | Set-Content -Path $log -Encoding UTF8
Write-Host ''
Write-Host "Log: $log" -ForegroundColor Green
