# NativeHarvest - TODO

## Authentication System Overhaul

Replace current env-var based admin auth with a proper user system supporting multiple login methods.

### Database Schema

```sql
CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE,
  phone         TEXT UNIQUE,
  password_hash TEXT,                    -- bcrypt hash (null for OAuth/OTP users)
  auth_provider TEXT DEFAULT 'local',    -- 'local', 'google', 'otp'
  google_id     TEXT UNIQUE,             -- for Google OAuth
  is_admin      BOOLEAN DEFAULT false,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Login Methods

| Method | Flow |
|--------|------|
| Email + Password | Register with email/password -> bcrypt hash -> login returns JWT |
| Mobile + OTP | Enter phone -> send OTP via SMS provider -> verify OTP -> JWT issued |
| Google Login | Google OAuth 2.0 -> verify token -> create/find user -> JWT issued |

### Open Decisions

- [ ] OTP provider: Twilio vs MSG91 vs Firebase Auth
- [ ] Google OAuth: Need Google Cloud project with OAuth credentials
- [ ] Customer login: Should customers log in (order history, saved addresses) or admin only?
- [ ] Build all 3 methods at once or start with email+password?

### Admin Access

- `is_admin` column on users table
- First admin seeded via migration script
- Existing admins can promote other users from dashboard
