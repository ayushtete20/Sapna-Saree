# Sapna Sarees Platform - PowerShell Launcher
Write-Host "===================================================" -ForegroundColor Magenta
Write-Host "    SAPNA SAREES BY LAVICHITRA - ATELIER SUITE" -ForegroundColor Magenta
Write-Host "===================================================" -ForegroundColor Magenta
Write-Host ""

$baseDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Install dependencies if missing
@('backend', 'frontend', 'dashboard') | ForEach-Object {
    $dir = Join-Path $baseDir $_
    if (-not (Test-Path (Join-Path $dir "node_modules"))) {
        Write-Host "Installing dependencies for $_..." -ForegroundColor Cyan
        Start-Process "npm" -ArgumentList "install" -WorkingDirectory $dir -Wait -NoNewWindow
    }
}

# Launch servers
Write-Host "Launching Backend on Port 8000..." -ForegroundColor Green
Start-Process "cmd" -ArgumentList "/k title Backend-8000 && npm start" -WorkingDirectory (Join-Path $baseDir "backend")

Write-Host "Launching Customer Storefront on Port 3000..." -ForegroundColor Green
Start-Process "cmd" -ArgumentList "/k title Storefront-3000 && npm start" -WorkingDirectory (Join-Path $baseDir "frontend")

Write-Host "Launching Atelier Staff Dashboard on Port 5000..." -ForegroundColor Green
Start-Process "cmd" -ArgumentList "/k title Dashboard-5000 && npm start" -WorkingDirectory (Join-Path $baseDir "dashboard")

Write-Host ""
Write-Host "All 3 services are active:" -ForegroundColor Yellow
Write-Host "  -> Storefront: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  -> Dashboard:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "  -> Backend:    http://localhost:8000" -ForegroundColor Cyan
