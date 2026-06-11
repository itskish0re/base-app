# Expose billing-frontend (Vite :5173) via your static ngrok dev domain.
# Requires: API on :5000, `pnpm dev` in billing-frontend, ngrok authtoken configured.
#
# Usage:
#   copy host-dev\ngrok.env.example host-dev\ngrok.env
#   # edit host-dev\ngrok.env with your NGROK_DOMAIN
#   pnpm tunnel   (from billing-frontend)

$ErrorActionPreference = 'Stop'
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$envFile = Join-Path $scriptDir 'ngrok.env'

if (-not (Test-Path $envFile)) {
    Write-Host "Missing $envFile" -ForegroundColor Red
    Write-Host "Copy ngrok.env.example to ngrok.env and set NGROK_DOMAIN."
    exit 1
}

Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        Set-Item -Path "env:$name" -Value $value
    }
}

if (-not $env:NGROK_DOMAIN) {
    Write-Host 'NGROK_DOMAIN is not set in ngrok.env' -ForegroundColor Red
    exit 1
}

$frontendPort = if ($env:NGROK_FRONTEND_PORT) { $env:NGROK_FRONTEND_PORT } else { '5173' }

Write-Host "Tunnel: https://$($env:NGROK_DOMAIN) -> localhost:$frontendPort"
Write-Host 'Stop with Ctrl+C when done.'
Write-Host ''

& ngrok http --domain=$env:NGROK_DOMAIN $frontendPort
