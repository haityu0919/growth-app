# DareTalk - token-server / LiveKit settings check
$env:Path = "$env:ProgramFiles\nodejs;" + $env:Path
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "========================================"
Write-Host "  DareTalk - Settings Check"
Write-Host "========================================"
Write-Host ""

$allOk = $true

# 1. .env
Write-Host "[1] .env file"
$envPath = Join-Path $PSScriptRoot '.env'
if (-not (Test-Path $envPath)) {
    Write-Host "    NG - .env not found" -ForegroundColor Red
    Write-Host "    Copy .env.example to .env and add LiveKit keys."
    $allOk = $false
} else {
    Write-Host "    OK - .env exists" -ForegroundColor Green
    $required = @('LIVEKIT_API_KEY', 'LIVEKIT_API_SECRET', 'LIVEKIT_URL', 'PORT')
    $lines = Get-Content $envPath
    $envMap = @{}
    foreach ($line in $lines) {
        if ($line -match '^\s*#' -or $line -match '^\s*$') { continue }
        if ($line -match '^\s*([A-Z_]+)\s*=\s*(.*)$') {
            $envMap[$Matches[1]] = $Matches[2].Trim()
        }
    }
    foreach ($key in $required) {
        if ($envMap.ContainsKey($key)) {
            $value = $envMap[$key]
            if ($value -and $value -notmatch 'your_') {
                if ($key -eq 'LIVEKIT_URL') {
                    $lkHost = ($value -replace '^wss?://', '').Split('/')[0]
                    Write-Host "    OK - $key ($lkHost)" -ForegroundColor Green
                } elseif ($key -match 'SECRET|KEY') {
                    Write-Host "    OK - $key (set)" -ForegroundColor Green
                } else {
                    Write-Host "    OK - $key = $value" -ForegroundColor Green
                }
            } else {
                Write-Host "    NG - $key is empty or placeholder" -ForegroundColor Red
                $allOk = $false
            }
        } else {
            Write-Host "    NG - $key missing" -ForegroundColor Red
            $allOk = $false
        }
    }
}

# 2. PC IP vs config.js
Write-Host ""
Write-Host "[2] mobile\config.js IP"
$lanIp = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object { $_.IPAddress -like '192.168.*' } |
    Select-Object -First 1).IPAddress
$configPath = Join-Path (Split-Path $PSScriptRoot -Parent) 'mobile\config.js'
$configIp = $null
if (Test-Path $configPath) {
    $configText = Get-Content $configPath -Raw
    if ($configText -match "TOKEN_SERVER\s*=\s*'http://([0-9.]+):3001'") {
        $configIp = $Matches[1]
    }
}
Write-Host "    PC LAN IP:     $lanIp"
Write-Host "    config.js IP:  $configIp"
if ($lanIp -and $configIp -eq $lanIp) {
    Write-Host "    OK - IPs match" -ForegroundColor Green
} else {
    Write-Host "    NG - update mobile\config.js to http://${lanIp}:3001" -ForegroundColor Red
    $allOk = $false
}

# 3. Server health
Write-Host ""
Write-Host "[3] token-server API"
try {
    $health = Invoke-RestMethod -Uri 'http://127.0.0.1:3001/api/health' -TimeoutSec 3
    if ($health.ok) {
        Write-Host "    OK - server running" -ForegroundColor Green
    }
    if ($health.livekitConfigured) {
        Write-Host "    OK - LiveKit configured" -ForegroundColor Green
    } else {
        Write-Host "    NG - LiveKit not configured" -ForegroundColor Red
        $allOk = $false
    }
} catch {
    Write-Host "    NG - server not running" -ForegroundColor Yellow
    Write-Host "    Start: サーバー起動.bat" -ForegroundColor Yellow
    $allOk = $false
}

# 4. Match test (only if server running)
if ($health -and $health.ok) {
    Write-Host ""
    Write-Host "[4] Matching + token test"
    try {
        $body = '{"profile":{"ageGroup":"20代","gender":"男性"}}'
        $a = Invoke-RestMethod -Uri 'http://127.0.0.1:3001/api/join' -Method POST -ContentType 'application/json' -Body $body -TimeoutSec 5
        $b = Invoke-RestMethod -Uri 'http://127.0.0.1:3001/api/join' -Method POST -ContentType 'application/json' -Body $body -TimeoutSec 5
        $matched = $a, $b | Where-Object { $_.status -eq 'matched' -and $_.token }
        if ($matched.Count -ge 1) {
            Write-Host "    OK - match works, JWT issued" -ForegroundColor Green
            Write-Host "    LiveKit: $($matched[0].livekitUrl)"
        } else {
            Write-Host "    WARN - join works but no match in test (queue may be busy)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "    NG - join API failed" -ForegroundColor Red
        $allOk = $false
    }
}

Write-Host ""
if ($allOk) {
    Write-Host "Result: ALL OK" -ForegroundColor Green
} else {
    Write-Host "Result: NEEDS FIX (see NG items above)" -ForegroundColor Red
}
Write-Host ""
