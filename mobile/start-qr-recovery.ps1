# DareTalk - Expo recovery (cache clear + LAN)
$env:Path = "$env:ProgramFiles\nodejs;" + $env:Path
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "========================================"
Write-Host "  DareTalk - Recovery Start"
Write-Host "========================================"
Write-Host ""
Write-Host "Use this when Expo Go stays on 'Opening project'."
Write-Host ""

$listeners = netstat -ano | Select-String ":8081\s+.*LISTENING"
foreach ($line in $listeners) {
    $procId = ($line -split '\s+')[-1]
    if ($procId -match '^\d+$') {
        Stop-Process -Id ([int]$procId) -Force -ErrorAction SilentlyContinue
    }
}
Start-Sleep -Seconds 2

$lanIp = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object { $_.IPAddress -like '192.168.*' } |
    Select-Object -First 1).IPAddress

Write-Host "[1] Cleared old server on port 8081"
Write-Host "[2] Starting with cache clear (--clear)..."
Write-Host ""
if ($lanIp) {
    Write-Host "    Manual URL: exp://${lanIp}:8081" -ForegroundColor Green
}
Write-Host ""
Write-Host "    Wait until PC shows: 'Metro waiting on http://localhost:8081'"
Write-Host "    THEN scan QR on phone (not before)."
Write-Host ""
Write-Host "    iPhone: Settings > Expo Go > enable Local Network"
Write-Host "    PC and phone: same Wi-Fi"
Write-Host ""

npx expo start --go --lan --port 8081 --clear
