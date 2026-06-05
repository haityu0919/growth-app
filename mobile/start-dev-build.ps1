# DareTalk - EAS development build helper
$env:Path = "$env:ProgramFiles\nodejs;" + $env:Path
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "========================================"
Write-Host "  DareTalk - Dev Build (EAS)"
Write-Host "========================================"
Write-Host ""
Write-Host "LiveKit voice needs a development build."
Write-Host "Expo Go cannot run native audio modules."
Write-Host ""

function Test-EasCli {
    $easCmd = Get-Command eas -ErrorAction SilentlyContinue
    if ($easCmd) { return $true }
    $npxEas = & npx --yes eas-cli --version 2>$null
    return $LASTEXITCODE -eq 0
}

if (-not (Test-EasCli)) {
    Write-Host "Installing EAS CLI..."
    npm install -g eas-cli
}

Write-Host ""
Write-Host "Step 1: Login (first time only)"
Write-Host "  eas login"
Write-Host ""
Write-Host "Step 2: Build"
Write-Host "  Android: eas build --profile development --platform android"
Write-Host "  iOS:     eas build --profile development --platform ios"
Write-Host ""
Write-Host "Step 3: After install on phone"
Write-Host "  1. token-server\サーバー起動.bat"
Write-Host "  2. start-expo-devclient.bat"
Write-Host "  3. Open dev app (NOT Expo Go) and scan QR"
Write-Host ""

$loggedIn = $false
try {
    $whoami = eas whoami 2>$null
    if ($LASTEXITCODE -eq 0 -and $whoami) {
        Write-Host "Logged in as: $whoami" -ForegroundColor Green
        $loggedIn = $true
    }
} catch {}

if (-not $loggedIn) {
    Write-Host "Not logged in yet. Running eas login..." -ForegroundColor Yellow
    eas login
}

Write-Host ""
Write-Host "Select platform:"
Write-Host "  1) Android (recommended for 2-phone test)"
Write-Host "  2) iOS (Apple Developer account required)"
Write-Host "  3) Cancel"
Write-Host ""
$choice = Read-Host "Choice [1/2/3]"

switch ($choice) {
    '1' {
        Write-Host ""
        Write-Host "Starting Android development build..."
        Write-Host "This takes about 10-20 minutes on Expo servers."
        Write-Host ""
        eas build --profile development --platform android
    }
    '2' {
        Write-Host ""
        Write-Host "Starting iOS development build..."
        eas build --profile development --platform ios
    }
    default {
        Write-Host "Cancelled."
    }
}
