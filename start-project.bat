@echo off
title Sapna Sarees Platform Launcher
echo ===================================================
echo     SAPNA SAREES BY LAVICHITRA - ATELIER SUITE
echo ===================================================
echo.

echo [1/3] Checking dependencies...
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend && npm install && cd ..
)
if not exist "frontend\node_modules" (
    echo Installing storefront frontend dependencies...
    cd frontend && npm install && cd ..
)
if not exist "dashboard\node_modules" (
    echo Installing admin dashboard dependencies...
    cd dashboard && npm install && cd ..
)

echo.
echo [2/3] Launching all services...
echo Starting Backend API Engine on port 8000...
start "Sapna Sarees Backend (8000)" cmd /k "cd backend && npm start"

echo Starting Customer Storefront on port 3000...
start "Sapna Sarees Storefront (3000)" cmd /k "cd frontend && npm start"

echo Starting Atelier Staff Dashboard on port 5000...
start "Sapna Sarees Dashboard (5000)" cmd /k "cd dashboard && npm start"

echo.
echo ===================================================
echo All services launched successfully!
echo   - Customer Storefront: http://localhost:3000
echo   - Atelier Dashboard:   http://localhost:5000
echo   - Backend API Engine:  http://localhost:8000
echo ===================================================
echo.
pause
