#!/bin/bash

# FreshHarvest - Automated Local Setup for macOS/Linux
# This script automates the entire setup process for local development

set -e  # Exit on error

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo ""
echo "========================================"
echo "  FreshHarvest - Local Setup Assistant"
echo "========================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_error() {
    echo -e "${RED}ERROR: $1${NC}"
}

print_success() {
    echo -e "${GREEN}$1${NC}"
}

print_warning() {
    echo -e "${YELLOW}WARNING: $1${NC}"
}

# Check if Node.js is installed
echo "[1/7] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    echo "Or install via package manager:"
    echo "  macOS:  brew install node"
    echo "  Ubuntu: sudo apt-get install nodejs npm"
    exit 1
fi
print_success "Node.js: OK ($(node --version))"
echo "npm version: $(npm --version)"

# Check if Git is installed
echo ""
echo "[2/7] Checking Git installation..."
if ! command -v git &> /dev/null; then
    print_error "Git is not installed!"
    echo "Please download and install Git from https://git-scm.com/"
    echo "Or install via package manager:"
    echo "  macOS:  brew install git"
    echo "  Ubuntu: sudo apt-get install git"
    exit 1
fi
print_success "Git: OK ($(git --version))"

# Check if PostgreSQL is installed
echo ""
echo "[3/7] Checking PostgreSQL installation..."
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL is not found in PATH"
    echo "PostgreSQL Installation Guide:"
    echo ""
    echo "  macOS:"
    echo "    brew install postgresql@15"
    echo "    brew services start postgresql@15"
    echo ""
    echo "  Ubuntu:"
    echo "    sudo apt-get install postgresql postgresql-contrib"
    echo "    sudo systemctl start postgresql"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    print_success "PostgreSQL: OK ($(psql --version))"
fi

# Create .env file if it doesn't exist
echo ""
echo "[4/7] Setting up environment variables..."
if [ -f .env ]; then
    echo ".env file already exists"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Using existing .env file"
        goto skip_env
    fi
fi

echo "Creating .env file with default values..."
cat > .env << 'EOF'
# DATABASE CONFIGURATION
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fresh_harvest
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=postgres
PGDATABASE=fresh_harvest

# STRIPE CONFIGURATION
# Get from https://dashboard.stripe.com/apikeys
# Use TEST keys: pk_test_* and sk_test_*
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE

# SESSION CONFIGURATION
SESSION_SECRET=fresh_harvest_dev_session_secret_key_12345678901234567890

# REPLIT AUTH
REPLIT_CLIENT_ID=your_replit_client_id
REPLIT_CLIENT_SECRET=your_replit_client_secret
REPLIT_AUTH_REDIRECT_URI=http://localhost:5000/auth/callback

# NODE ENVIRONMENT
NODE_ENV=development
PORT=5000
EOF

print_success ".env file created successfully!"

echo ""
echo "========================================"
echo "  IMPORTANT: Configure Stripe Credentials"
echo "========================================"
echo ""
echo "Please follow these steps:"
echo ""
echo "1. Go to: https://dashboard.stripe.com/"
echo "2. Sign in or create a free account"
echo "3. Go to: Developers > API Keys"
echo "4. Copy your TEST keys:"
echo "   - Publishable Key (starts with pk_test_)"
echo "   - Secret Key (starts with sk_test_)"
echo "5. Edit .env file and replace:"
echo "   - STRIPE_SECRET_KEY"
echo "   - STRIPE_PUBLISHABLE_KEY"
echo "   - VITE_STRIPE_PUBLISHABLE_KEY"
echo ""
echo "Test Stripe Credentials for Development:"
echo "  Card: 4242 4242 4242 4242"
echo "  Expiry: Any future date (e.g., 12/25)"
echo "  CVC: Any 3 digits (e.g., 123)"
echo "  UPI: success@okhdfcbank"
echo ""
read -p "Press Enter when you've added your Stripe keys to .env..."

# Create PostgreSQL database
echo ""
echo "[5/7] Setting up PostgreSQL database..."
echo ""
echo "Attempting to create database: fresh_harvest"
echo ""

if createdb fresh_harvest 2>/dev/null; then
    print_success "Database created successfully!"
else
    print_warning "Could not create database automatically"
    echo "This might be because:"
    echo "  - PostgreSQL is not running"
    echo "  - Database already exists"
    echo ""
    echo "Manual setup:"
    echo "  1. Ensure PostgreSQL service is running"
    echo "  2. Run: createdb fresh_harvest"
    echo "  3. Or use: psql -U postgres"
    echo "     Then: CREATE DATABASE fresh_harvest;"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies
echo ""
echo "[6/7] Installing npm dependencies..."
echo "This may take a few minutes..."
npm install
if [ $? -ne 0 ]; then
    print_error "npm install failed"
    exit 1
fi
print_success "Dependencies installed successfully!"

# Run database migrations
echo ""
echo "[7/7] Running database migrations..."
npm run db:push || print_warning "Database migrations failed (PostgreSQL might not be running)"

# Success message
echo ""
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Open your browser and go to:"
echo "   http://localhost:5000"
echo ""
echo "3. Login with your email"
echo ""
echo "4. Test with sample products and checkout"
echo ""
echo "For detailed setup instructions, see: SETUP.md"
echo ""
echo "========================================"
echo ""
