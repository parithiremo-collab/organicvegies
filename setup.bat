@echo off
REM FreshHarvest - Automated Local Setup for Windows
REM This script automates the entire setup process for local development

setlocal enabledelayedexpansion
set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo.
echo ========================================
echo   FreshHarvest - Local Setup Assistant
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/7] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)
echo Node.js: OK
npm --version

REM Check if Git is installed
echo.
echo [2/7] Checking Git installation...
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed!
    echo Please download and install Git from https://git-scm.com/
    echo Then run this script again.
    pause
    exit /b 1
)
echo Git: OK

REM Check if PostgreSQL is installed
echo.
echo [3/7] Checking PostgreSQL installation...
psql --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: PostgreSQL is not in PATH!
    echo If you have PostgreSQL installed, add it to PATH:
    echo   Control Panel ^> Environment Variables ^> Add PostgreSQL bin folder to PATH
    echo.
    echo PostgreSQL Installation Guide:
    echo   Download: https://www.postgresql.org/download/windows/
    echo   Default installation puts psql at: C:\Program Files\PostgreSQL\XX\bin\
    echo.
    set /p "continue=Continue anyway (y/n)? "
    if /i not "!continue!"=="y" exit /b 1
) else (
    echo PostgreSQL: OK
)

REM Create .env file if it doesn't exist
echo.
echo [4/7] Setting up environment variables...
if exist .env (
    echo .env file already exists
    set /p "override=Do you want to overwrite it (y/n)? "
    if /i not "!override!"=="y" (
        echo Using existing .env file
        goto skip_env
    )
)

echo Creating .env file with default values...
(
    echo # DATABASE CONFIGURATION
    echo DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fresh_harvest
    echo PGHOST=localhost
    echo PGPORT=5432
    echo PGUSER=postgres
    echo PGPASSWORD=postgres
    echo PGDATABASE=fresh_harvest
    echo.
    echo # STRIPE CONFIGURATION
    echo # Get from https://dashboard.stripe.com/apikeys
    echo # Use TEST keys: pk_test_* and sk_test_*
    echo STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
    echo STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
    echo VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
    echo.
    echo # SESSION CONFIGURATION
    echo SESSION_SECRET=fresh_harvest_dev_session_secret_key_12345678901234567890
    echo.
    echo # REPLIT AUTH
    echo REPLIT_CLIENT_ID=your_replit_client_id
    echo REPLIT_CLIENT_SECRET=your_replit_client_secret
    echo REPLIT_AUTH_REDIRECT_URI=http://localhost:5000/auth/callback
    echo.
    echo # NODE ENVIRONMENT
    echo NODE_ENV=development
    echo PORT=5000
) > .env
echo .env file created successfully!

:skip_env
echo.
echo ========================================
echo  IMPORTANT: Configure Stripe Credentials
echo ========================================
echo Please follow these steps:
echo.
echo 1. Go to: https://dashboard.stripe.com/
echo 2. Sign in or create a free account
echo 3. Go to: Developers ^> API Keys
echo 4. Copy your TEST keys:
echo    - Publishable Key (starts with pk_test_)
echo    - Secret Key (starts with sk_test_)
echo 5. Edit .env file and replace:
echo    - STRIPE_SECRET_KEY
echo    - STRIPE_PUBLISHABLE_KEY
echo    - VITE_STRIPE_PUBLISHABLE_KEY
echo.
echo Test Stripe Credentials for Development:
echo   Card: 4242 4242 4242 4242
echo   Expiry: Any future date (e.g., 12/25)
echo   CVC: Any 3 digits (e.g., 123)
echo   UPI: success@okhdfcbank
echo.
set /p "ready=Press Enter when you've added your Stripe keys to .env..."

REM Create PostgreSQL database
echo.
echo [5/7] Setting up PostgreSQL database...
echo.
echo Attempting to create database: fresh_harvest
echo.

REM Try to create database
psql -U postgres -c "CREATE DATABASE fresh_harvest;" 2>nul
if errorlevel 1 (
    echo WARNING: Could not create database automatically
    echo This might be because:
    echo   - PostgreSQL is not running
    echo   - Authentication failed
    echo   - Database already exists
    echo.
    echo Manual setup:
    echo   1. Open pgAdmin or SQL Shell (psql)
    echo   2. Login with your PostgreSQL credentials
    echo   3. Run: CREATE DATABASE fresh_harvest;
    echo   4. Update .env with correct credentials
    echo.
    set /p "continue=Continue anyway (y/n)? "
    if /i not "!continue!"=="y" exit /b 1
) else (
    echo Database created successfully!
)

REM Install dependencies
echo.
echo [6/7] Installing npm dependencies...
echo This may take a few minutes...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)
echo Dependencies installed successfully!

REM Run database migrations
echo.
echo [7/7] Running database migrations...
call npm run db:push
if errorlevel 1 (
    echo WARNING: Database migrations failed
    echo This is usually because PostgreSQL is not running or credentials are wrong
    echo.
    echo To fix:
    echo   1. Ensure PostgreSQL service is running
    echo   2. Verify credentials in .env
    echo   3. Run: npm run db:push
)

REM Success message
echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Start the development server:
echo    npm run dev
echo.
echo 2. Open your browser and go to:
echo    http://localhost:5000
echo.
echo 3. Login with your email
echo.
echo 4. Test with sample products and checkout
echo.
echo For detailed setup instructions, see: SETUP.md
echo.
echo ========================================
echo.
pause
