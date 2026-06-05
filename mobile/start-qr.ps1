# DareTalk - Expo Go launcher (LAN / QR)
$env:Path = "$env:ProgramFiles\nodejs;" + $env:Path
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "========================================"
Write-Host "  DareTalk - Expo Go"
Write-Host "========================================"
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

$ips = @(Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object {
    $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254*'
})

$lanIp = ($ips | Where-Object { $_.IPAddress -like '192.168.*' } | Select-Object -First 1).IPAddress
if (-not $lanIp) {
    $lanIp = ($ips | Select-Object -First 1).IPAddress
}

Write-Host ""
Write-Host "[2] Manual URL (if QR does not show):"
if ($lanIp) {
    Write-Host "    exp://${lanIp}:8081" -ForegroundColor Green

    $configPath = Join-Path $PSScriptRoot 'config.js'
    if (Test-Path $configPath) {
        $configText = Get-Content $configPath -Raw
        if ($configText -match "TOKEN_SERVER\s*=\s*'http://([0-9.]+):3001'") {
            $configIp = $matches[1]
            if ($configIp -ne $lanIp) {
                Write-Host ""
                Write-Host "    [hint] config.js uses ${configIp} but PC IP is ${lanIp}" -ForegroundColor Yellow
                Write-Host "           If app cannot reach server, update mobile\config.js" -ForegroundColor Yellow
            }
        }
    }
} else {
    Write-Host "    exp://YOUR_PC_IP:8081  (check: ipconfig)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[3] Starting Expo (LAN)..."
Write-Host "    Browser opens when server is ready (not fixed 12 sec)."
Write-Host "    PC and phone: SAME Wi-Fi"
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
    npx expo start --go --lan --port 8081
} finally {
    if ($browserJob) {
        Stop-Job $browserJob -ErrorAction SilentlyContinue
        Remove-Job $browserJob -Force -ErrorAction SilentlyContinue
    }
}
