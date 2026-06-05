# DareTalk - Expo tunnel (when LAN / Opening project fails)
$env:Path = "$env:ProgramFiles\nodejs;" + $env:Path
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "========================================"
Write-Host "  DareTalk - Tunnel Mode"
Write-Host "========================================"
Write-Host ""
Write-Host "Use when LAN QR stays on 'Opening project'."
Write-Host "Slower than LAN, but works across different networks."
Write-Host "First start may take 1-2 minutes."
Write-Host ""

$listeners = netstat -ano | Select-String ":8081\s+.*LISTENING"
foreach ($line in $listeners) {
    $procId = ($line -split '\s+')[-1]
    if ($procId -match '^\d+$') {
        Stop-Process -Id ([int]$procId) -Force -ErrorAction SilentlyContinue
    }
}
Start-Sleep -Seconds 1

npx expo start --go --tunnel --port 8081 --clear
