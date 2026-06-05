# 新ブランド画像を assets に反映
$ErrorActionPreference = 'Stop'
$mobile = Split-Path $PSScriptRoot -Parent

$candidates = @(
  "$env:USERPROFILE\.cursor\projects\C-Users-matsuda-AppData-Local-Temp-9c7c4516-54e7-4adf-8cc6-a1965637edfa\assets",
  "$env:USERPROFILE\.cursor\projects\c-Users-matsuda-Documents\canvases\..\assets",
  (Join-Path $mobile 'store-assets')
)

$gen = $null
foreach ($c in $candidates) {
  if (Test-Path (Join-Path $c 'daretalk-app-icon-1024.png')) { $gen = $c; break }
  if (Test-Path (Join-Path $c 'daretalk-launch-logo.png')) { $gen = $c; break }
}
if (-not $gen) {
  Write-Error "Generated assets folder not found. Re-run image generation in Cursor."
}

$assets = Join-Path $mobile 'assets'
$store = Join-Path $mobile 'store-assets'
New-Item -ItemType Directory -Force -Path $store | Out-Null

$map = @(
  @{ Src = 'daretalk-app-icon-1024.png'; Dst = 'icon.png' },
  @{ Src = 'daretalk-app-icon-1024.png'; Dst = 'adaptive-icon.png' },
  @{ Src = 'daretalk-launch-logo.png'; Dst = 'launch-logo.png' },
  @{ Src = 'daretalk-splash-portrait.png'; Dst = 'splash.png' }
)

foreach ($m in $map) {
  $srcPath = Join-Path $gen $m.Src
  if (-not (Test-Path $srcPath)) {
    Write-Warning "SKIP missing: $($m.Src)"
    continue
  }
  Copy-Item -Force $srcPath (Join-Path $assets $m.Dst)
  if ($m.Dst -eq 'icon.png') {
    Copy-Item -Force $srcPath (Join-Path $store 'app-icon-1024.png')
  }
  Write-Host "OK: assets\$($m.Dst) <- $($m.Src)"
}

# favicon: resize from icon via .NET if icon exists
$iconPath = Join-Path $assets 'icon.png'
$favPath = Join-Path $assets 'favicon.png'
if ((Test-Path $iconPath) -and -not (Test-Path (Join-Path $gen 'favicon.png'))) {
  Add-Type -AssemblyName System.Drawing
  $img = [System.Drawing.Image]::FromFile($iconPath)
  $bmp = New-Object System.Drawing.Bitmap 48, 48
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($img, 0, 0, 48, 48)
  $g.Dispose(); $img.Dispose()
  $bmp.Save($favPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host 'OK: favicon.png (from icon)'
}

Write-Host ''
Write-Host "Done. Run optimize-pngs.bat next." -ForegroundColor Green
