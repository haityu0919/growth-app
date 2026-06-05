# ストア掲載用画像を store-assets/screenshots へコピー
$ErrorActionPreference = 'Stop'
$mobile = Split-Path $PSScriptRoot -Parent
$gen = "$env:USERPROFILE\.cursor\projects\C-Users-matsuda-AppData-Local-Temp-9c7c4516-54e7-4adf-8cc6-a1965637edfa\assets"
$dest = Join-Path $mobile 'store-assets\screenshots'
New-Item -ItemType Directory -Force -Path $dest | Out-Null

if (-not (Test-Path $gen)) {
  Write-Error "Generated folder not found: $gen"
}

$final = @(
  'store-01-hero-voice.png',
  'store-02-random-call.png',
  'store-04-anonymous-voice.png',
  'store-05-kumorin-waiting.png',
  'store-03-safety.png',
  'store-play-feature-1024x500.png'
)
foreach ($name in $final) {
  $src = Join-Path $gen $name
  if (-not (Test-Path $src)) {
    Write-Warning "MISSING: $name"
    continue
  }
  if ($name -like 'store-play-*') {
    Copy-Item -Force $src (Join-Path $mobile 'store-assets\play-feature-graphic.png')
    Write-Host 'OK: play-feature-graphic.png'
  } else {
    Copy-Item -Force $src (Join-Path $dest $name)
    Write-Host "OK: screenshots\$name"
  }
}

Write-Host ''
Write-Host "Copied to: $dest" -ForegroundColor Green
