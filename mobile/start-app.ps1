# DareTalk app launcher
$env:Path = "$env:ProgramFiles\nodejs;" + $env:Path
Set-Location $PSScriptRoot

$listeners = netstat -ano | Select-String ":8081\s+.*LISTENING"
foreach ($line in $listeners) {
    $procId = ($line -split '\s+')[-1]
    if ($procId -match '^\d+$') {
        Stop-Process -Id ([int]$procId) -Force -ErrorAction SilentlyContinue
    }
}
Start-Sleep -Seconds 1

Write-Host "Starting DareTalk (Expo)..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop." -ForegroundColor Gray
npx expo start
