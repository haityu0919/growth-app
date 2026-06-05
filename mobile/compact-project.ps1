# だれトーク プロジェクト整理（容量削減）
# 使い方: PowerShell で mobile フォルダから実行
#   powershell -ExecutionPolicy Bypass -File compact-project.ps1

$ErrorActionPreference = 'SilentlyContinue'
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $here

Write-Host '=== だれトーク コンパクト化 ===' -ForegroundColor Cyan

# 1) Expo エクスポートのテスト用フォルダ
$testDirs = @('.expo-go-test', '.expo-livekit-test', '.expo-web-test')
foreach ($d in $testDirs) {
  if (Test-Path $d) {
    Remove-Item -Recurse -Force $d
    Write-Host "削除: $d"
  }
}

# 2) 使っていない画像（採用済みのコピーは残す）
$unusedAssets = @(
  'logo-refined-01.png', 'logo-refined-02.png', 'logo-refined-03.png',
  'logo-refined-04.png', 'logo-refined-05.png',
  'logo-refined-02-voice-bubbles.png',
  'daretalk-mascot.png',
  'daretalk-mascot-kumorin-night.png',
  'kumorin-waiting-blend.png'
)
foreach ($name in $unusedAssets) {
  $p = Join-Path 'assets' $name
  if (Test-Path $p) {
    Remove-Item -Force $p
    Write-Host "削除: assets\$name"
  }
}

# 3) 一時的に入れた sharp（package.json に無い場合）
if (Test-Path 'node_modules\sharp') {
  npm uninstall sharp 2>$null | Out-Null
  Remove-Item -Recurse -Force 'node_modules\sharp', 'node_modules\@img\sharp-win32-x64' -ErrorAction SilentlyContinue
  Write-Host '削除: node_modules 内の sharp（一時インストール分）'
}

# 4) PNG 軽量化
$optPs1 = Join-Path $here 'scripts\optimize-pngs.ps1'
npm install --no-save sharp 2>$null | Out-Null
if (Test-Path 'node_modules\sharp') {
  node (Join-Path $here 'scripts\optimize-pngs.cjs') 2>$null
  npm uninstall sharp 2>$null | Out-Null
  Remove-Item -Recurse -Force 'node_modules\sharp', 'node_modules\@img\sharp-win32-x64' -ErrorAction SilentlyContinue
} elseif (Test-Path $optPs1) {
  & powershell -NoProfile -ExecutionPolicy Bypass -File $optPs1
}
if (Test-Path (Join-Path $here 'optimize-pngs-log.txt')) {
  Get-Content (Join-Path $here 'optimize-pngs-log.txt') | ForEach-Object { Write-Host $_ }
}

Write-Host ''
Write-Host '完了。Expo は start-expo-qr.bat から起動してください。' -ForegroundColor Green
