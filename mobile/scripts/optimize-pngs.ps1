# PNG 軽量化（.NET のみ・npm 不要）
# mobile フォルダで: powershell -ExecutionPolicy Bypass -File scripts\optimize-pngs.ps1

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$assets = Join-Path $PSScriptRoot '..\assets' | Resolve-Path
$log = Join-Path $PSScriptRoot '..\optimize-pngs-log.txt'
$lines = @("=== PNG optimize $(Get-Date -Format 'yyyy-MM-dd HH:mm') ===")

$targets = @(
  @{ Name = 'icon.png'; MaxW = 1024 },
  @{ Name = 'adaptive-icon.png'; MaxW = 1024 },
  @{ Name = 'splash.png'; MaxW = 1280 },
  @{ Name = 'favicon.png'; MaxW = 48 },
  @{ Name = 'launch-logo.png'; MaxW = 512 },
  @{ Name = 'kumorin-waiting.png'; MaxW = 720 }
)

function Save-PngSmaller($path, $maxW) {
  $img = [System.Drawing.Image]::FromFile($path)
  try {
    $w = $img.Width
    $h = $img.Height
    if ($w -le $maxW) {
      $newW = $w
      $newH = $h
    } else {
      $ratio = $maxW / [double]$w
      $newW = [int][Math]::Round($w * $ratio)
      $newH = [int][Math]::Round($h * $ratio)
    }
    $bmp = New-Object System.Drawing.Bitmap $newW, $newH
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($img, 0, 0, $newW, $newH)
    $g.Dispose()
    $tmp = "$path.tmp"
    $bmp.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Move-Item -Force $tmp $path
    return @{ W = $newW; H = $newH }
  } finally {
    $img.Dispose()
  }
}

foreach ($t in $targets) {
  $path = Join-Path $assets $t.Name
  if (-not (Test-Path $path)) {
    $lines += "SKIP: $($t.Name) (not found)"
    continue
  }
  $before = (Get-Item $path).Length
  $dim = Save-PngSmaller $path $t.MaxW
  $after = (Get-Item $path).Length
  $bKb = [math]::Round($before / 1KB, 1)
  $aKb = [math]::Round($after / 1KB, 1)
  $pct = if ($before -gt 0) { [math]::Round((1 - $after / $before) * 100) } else { 0 }
  $lines += "$($t.Name): ${bKb} KB -> ${aKb} KB (-${pct}%)  $($dim.W)x$($dim.H) maxW=$($t.MaxW)"
}

$lines += 'DONE'
$lines | Set-Content -Path $log -Encoding UTF8
$lines | ForEach-Object { Write-Host $_ }
