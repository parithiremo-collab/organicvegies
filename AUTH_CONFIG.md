# Authentication Configuration Guide

This application supports two authentication modes, configurable via the `ENABLE_REPLIT_AUTH` environment variable.

## Authentication Modes

### 1. Replit Auth Mode (Production)
**Default**: `ENABLE_REPLIT_AUTH=true`

Uses Replit's built-in OpenID Connect (OIDC) authentication for production deployments.

**Features**:
- Replit account integration
- Secure OAuth flow
- Automatic user creation from claims
- Token refresh support

**To enable** (default):
```bash
ENABLE_REPLIT_AUTH=true
# or simply don't set it (true is the default)
```

### 2. Test Auth Mode (Development)
**Set**: `ENABLE_REPLIT_AUTH=false`

Uses local test authentication with hardcoded test users for rapid development.

**Features**:
- 5 test users ready to login instantly
- No external auth required
- Instant role-based dashboard access
- Session persistence via PostgreSQL

**To enable**:
```bash
ENABLE_REPLIT_AUTH=false
```

## Test Users (When ENABLE_REPLIT_AUTH=false)

When test auth mode is active, the following test users are available:

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@test.local | (click "Test Login") |
| Farmer (Seller) | farmer@test.local | (click "Test Login") |
| Agent | agent@test.local | (click "Test Login") |
| Admin | admin@test.local | (click "Test Login") |
| Super Admin | superadmin@test.local | (click "Test Login") |

## Quick Start

### For Development (Test Auth)
```bash
# Enable test auth mode
ENABLE_REPLIT_AUTH=false

# Start the app
npm run dev

# Visit http://localhost:5000
# Click a test login button on the login page
```

### For Production (Replit Auth)
```bash
# Use default (Replit Auth enabled)
ENABLE_REPLIT_AUTH=true
# or leave unset

# App will use Replit's OIDC authentication
```

## How It Works

### Authentication Flow (Replit Auth)
1. User clicks "Login as [Role]"
2. Redirected to Replit's OIDC endpoint
3. User authenticates with Replit account
4. Token exchanged for session
5. User routed to role-specific dashboard

### Authentication Flow (Test Auth)
1. User clicks "Test Login: [Role]"
2. Frontend makes POST request to `/api/test/login/{role}`
3. Server creates fake session with test user
4. Session stored in PostgreSQL
5. Browser redirected to dashboard
6. useAuth hook fetches user data via `/api/auth/user`
7. Router renders correct role-based dashboard

## Architecture

### Files Involved
- `server/replitAuth.ts` - Replit OIDC setup
- `server/testAuth.ts` - Test auth endpoints & session middleware
- `server/routes.ts` - Auth conditional setup
- `client/src/pages/UnifiedLogin.tsx` - Login UI with test buttons (dev only)
- `client/src/hooks/useAuth.ts` - Auth state management

### Key Functions
- `isReplitAuthEnabled()` - Checks if Replit Auth is enabled
- `setupAuth()` - Configures Replit OIDC (runs only if enabled)
- `setupSessionMiddleware()` - Provides session fallback for test auth
- `setupTestAuth()` - Sets up test login endpoints

## Session Storage

Both modes use PostgreSQL for session persistence via `connect-pg-simple`:
- Sessions stored in `sessions` table
- Session TTL: 7 days
- Secure cookies (HTTP-only, SameSite=Lax)
- Secure flag enabled in production

## API Endpoints

### Always Available
- `GET /api/auth/user` - Get current authenticated user
- `GET /api/logout` - Logout (Replit Auth)

### Test Auth Only (development)
- `POST /api/test/login/:role` - Quick login as test user
- `POST /api/test/logout` - Quick logout (test auth)
- `GET /api/test/users` - List available test users

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `ENABLE_REPLIT_AUTH` | true | Enable/disable Replit OIDC auth |
| `NODE_ENV` | - | Set to "development" for test auth UI |
| `DATABASE_URL` | - | PostgreSQL connection string |
| `SESSION_SECRET` | - | Session encryption secret |
| `REPL_ID` | - | Replit app ID (production) |
| `ISSUER_URL` | https://replit.com/oidc | OIDC issuer (production) |

## Troubleshooting

### "Unauthorized" on login page
- Verify `DATABASE_URL` is set correctly
- Check `SESSION_SECRET` is configured
- Ensure `sessions` table exists in database

### Test buttons not showing
- Verify `NODE_ENV=development` is set
- Check browser console for errors
- Ensure `ENABLE_REPLIT_AUTH=false`

### Session not persisting
- Check cookies are being saved (browser DevTools)
- Verify `secure` flag matches your setup (HTTP vs HTTPS)
- Check PostgreSQL sessions table has records

## Summary

This dual-mode authentication system gives you:
- **Production flexibility**: Replit Auth for real users
- **Development speed**: Test Auth for instant dashboard access
- **Easy switching**: Single environment variable to toggle modes

Just set `ENABLE_REPLIT_AUTH=false` during development for the best experience!
