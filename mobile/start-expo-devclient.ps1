# DareTalk - Expo dev client launcher (LAN)
$env:Path = "$env:ProgramFiles\nodejs;" + $env:Path
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "========================================"
Write-Host "  DareTalk - Dev Client (LAN)"
Write-Host "========================================"
Write-Host ""
Write-Host "Use AFTER installing the development build app."
Write-Host "Do NOT use Expo Go for voice calls."
Write-Host ""

$listeners = netstat -ano | Select-String ":8081\s+.*LISTENING"
if ($listeners) {
    Write-Host "[1] Port 8081 was busy. Stopping old server..."
    foreach ($line in $listeners) {
        $procId = ($line -split '\s+')[-1]
        if ($procId -match '^\d+$') {
            Stop-Process -Id ([int]$procId) -Force -ErrorAction SilentlyContinue
        }
    }
    Start-Sleep -Seconds 1
} else {
    Write-Host "[1] Port 8081 is free."
}

$lanIp = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object { $_.IPAddress -like '192.168.*' } |
    Select-Object -First 1).IPAddress

Write-Host ""
Write-Host "[2] Open the dev build app on phone, then scan QR."
if ($lanIp) {
    Write-Host "    Manual URL: exp://${lanIp}:8081" -ForegroundColor Green
}
Write-Host ""
Write-Host "[3] Starting Expo for dev client..."
Write-Host "    PC and phone: SAME Wi-Fi (for matching server too)"
Write-Host "    Stop: Ctrl+C"
Write-Host ""

$openBrowser = {
    $url = 'http://127.0.0.1:8081'
    for ($i = 0; $i -lt 60; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2 -ErrorAction Stop
            if ($response.StatusCode -ge 200) {
                Start-Process 'http://localhost:8081'
                return
            }
        } catch {
            Start-Sleep -Seconds 1
        }
    }
}

$browserJob = Start-Job -ScriptBlock $openBrowser

try {
    npx expo start --dev-client --lan --port 8081
} finally {
    if ($browserJob) {
        Stop-Job $browserJob -ErrorAction SilentlyContinue
        Remove-Job $browserJob -Force -ErrorAction SilentlyContinue
    }
}
