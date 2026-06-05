# だれトーク — トンネル接続で起動（スマホがつながりやすい）
$env:Path = "$env:ProgramFiles\nodejs;" + $env:Path
Set-Location $PSScriptRoot
npx expo start --tunnel
