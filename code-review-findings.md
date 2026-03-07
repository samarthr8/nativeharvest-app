# NativeHarvest - Code Review & Architecture Analysis

**Date:** 2026-03-07
**Branch:** feature/ui-refinement
**Reviewed by:** Claude Opus 4.6

---

## Executive Summary

A comprehensive review of the NativeHarvest codebase across Backend, Frontend, and DevOps/Infrastructure revealed **79 findings** spanning security vulnerabilities, code quality issues, UX gaps, and infrastructure concerns.

| Area | Critical | High | Medium | Low | Total |
|------|----------|------|--------|-----|-------|
| Backend | 1 | 8 | 12 | 2 | 23 |
| Frontend | 0 | 8 | 16 | 6 | 30 |
| DevOps/Infra | 2 | 10 | 12 | 2 | 26 |
| **Total** | **3** | **26** | **40** | **10** | **79** |

---

## CRITICAL FINDINGS (Fix Immediately)

### C1. Hardcoded Admin Credentials
- **Area:** Backend
- **File:** `backend/src/routes/admin.js` (lines 5-7)
- **Issue:** Admin login credentials are hardcoded with defaults that should never exist in production.
```javascript
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nativeharvest.in";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "nativeharvestsecret";
```
- **Impact:** Anyone can log in as admin using default credentials if env vars are not set.
- **Fix:**
  - Remove all hardcoded defaults
  - Require all three to be set via environment variables
  - Throw an error at startup if any are missing
  - Use bcrypt to hash passwords instead of storing plain text
  - Regenerate JWT_SECRET with a cryptographically random value

### C2. No Database Persistence in Docker Compose
- **Area:** DevOps
- **File:** `cd/docker-compose.yml`
- **Issue:** Docker Compose has no PostgreSQL service or volumes defined. Database is not managed as infrastructure-as-code.
- **Impact:** Data loss on container restart. Database must be manually managed outside Docker Compose.
- **Fix:** Add PostgreSQL service with persistent volume:
```yaml
services:
  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME:-nativeharvest}
      POSTGRES_USER: ${DB_USER:-nhuser}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-nhuser}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### C3. Secrets in Helm Values
- **Area:** DevOps
- **File:** `helm/nativeharvest/values.yaml`
- **Issue:** Secrets stored as empty strings in values.yaml with no external secret management. If committed with real values, secrets are exposed in git history.
- **Impact:** Credential leakage, no secret rotation mechanism.
- **Fix:** Use external secret management (HashiCorp Vault, AWS Secrets Manager, or Kubernetes External Secrets Operator).

---

## HIGH SEVERITY FINDINGS

### Backend

#### H-BE-1. No Input Validation Anywhere
- **Files:** `routes/orders.js` (lines 67-78), `routes/admin-products.js` (lines 7-35, 103-114), `controllers/contactController.js` (lines 1-5)
- **Issue:** No validation of customer input fields across the entire backend. Orders, products, coupons, and contact forms accept any data without checks for valid email format, phone number format, address length, negative prices/stock, or required fields.
- **Impact:** SQL injection risk, invalid data in database, spam injection, business logic bypass.
- **Fix:** Use a validation library like `joi` or `zod`:
```javascript
const schema = joi.object({
  customer_name: joi.string().required().max(100),
  email: joi.string().email().required(),
  phone: joi.string().regex(/^\d{10}$/).required(),
  address: joi.string().max(500),
  items: joi.array().items(joi.object({
    slug: joi.string().required(),
    qty: joi.number().integer().min(1).required()
  })).min(1).required()
});
```

#### H-BE-2. XSS Vulnerability in SEO Endpoint
- **File:** `backend/src/app.js` (lines 75-100)
- **Issue:** Product name and description are directly embedded in HTML without escaping in the SEO bot response.
```javascript
const botHtml = `
  <title>${product.name} | NativeHarvest India</title>
  <meta name="description" content="${product.description}" />
`;
```
- **Impact:** If database is compromised or admin enters malicious content, script injection is possible.
- **Fix:** Use `he` library to HTML-escape values:
```javascript
const he = require('he');
const botHtml = `<title>${he.escape(product.name)} | NativeHarvest India</title>`;
```

#### H-BE-3. No File Type/Size Validation on S3 Uploads
- **File:** `backend/src/routes/admin-upload.js` (lines 12-33)
- **Issue:** No file type validation. Files uploaded directly to S3 with user-provided MIME type. Can upload executables, malicious content, or oversized files.
- **Fix:**
```javascript
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

if (!ALLOWED_TYPES.includes(file.mimetype)) {
  return res.status(400).json({ message: "Invalid file type" });
}
if (file.size > MAX_FILE_SIZE) {
  return res.status(400).json({ message: "File too large" });
}
```

#### H-BE-4. Missing Error Handling in Routes
- **File:** `backend/src/routes/products.js` (lines 6-31), and other route files
- **Issue:** No try-catch in GET routes. If database query fails, the entire application may crash with an unhandled promise rejection.
- **Fix:** Wrap all async route handlers in try-catch:
```javascript
router.get("/", async (req, res) => {
  try {
    const result = await db.query(...);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});
```

#### H-BE-5. No Rate Limiting on Admin Login
- **File:** `backend/src/routes/admin.js` (lines 9-21)
- **Issue:** Admin login has no rate limiting. Vulnerable to brute force attacks, especially with weak default credentials.
- **Fix:**
```javascript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts"
});
router.post("/login", loginLimiter, (req, res) => { ... });
```

#### H-BE-6. Order Tracking Leaks Customer PII
- **File:** `backend/src/routes/order-tracking.js` (lines 8-59)
- **Issue:** Order tracking endpoint accepts any order ID without authentication. A user can view any order by guessing the order ID format (NH-XXXXXXXX), exposing customer names, emails, phone numbers, and addresses.
- **Fix:** Require email verification as additional parameter:
```javascript
router.get("/:orderId", async (req, res) => {
  const { email } = req.query;
  const orderResult = await db.query(
    `SELECT ... FROM orders WHERE order_id = $1 AND email = $2`,
    [req.params.orderId, email]
  );
});
```

#### H-BE-7. CORS Allows All Origins
- **File:** `backend/src/app.js` (line 26)
- **Issue:** `app.use(cors())` without configuration allows any website to make requests on behalf of users.
- **Fix:**
```javascript
app.use(cors({
  origin: ['https://nativeharvest.store', 'https://www.nativeharvest.store'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
```

#### H-BE-8. No Startup Validation for Required Environment Variables
- **Files:** All config files
- **Issue:** Critical env vars (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`, DB credentials) are used without startup validation. App starts with missing keys and fails at runtime.
- **Fix:**
```javascript
const required = ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'JWT_SECRET', 'DB_HOST', 'DB_PASSWORD'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing required env var: ${key}`);
}
```

---

### Frontend

#### H-FE-1. No Error Boundary
- **File:** `frontend/src/App.jsx`
- **Issue:** No React Error Boundary wraps routes. If any page component crashes (e.g., undefined property access), the entire app shows a blank white screen.
- **Fix:** Create `ErrorBoundary.jsx` component and wrap `<Routes>` with it.

#### H-FE-2. Memory Leak in OrderSuccess Polling
- **File:** `frontend/src/pages/OrderSuccess.jsx` (lines 11-36)
- **Issue:** `setInterval` runs every 5 seconds and only clears when payment status becomes "PAID". If user navigates away before payment, the interval continues running. Multiple visits stack intervals.
- **Fix:**
```javascript
useEffect(() => {
  const interval = setInterval(checkStatus, 5000);
  return () => clearInterval(interval); // Always clear on unmount
}, [orderId]);
```

#### H-FE-3. No Keyboard/Screen Reader Support
- **Files:** Entire codebase (44 occurrences of onMouseOver/onMouseOut)
- **Issue:** App relies entirely on hover states for interactions. Keyboard and screen reader users cannot navigate dropdown menus, see hover effects, or understand interactive elements. Only 1 `aria-label` found in entire codebase (WhatsAppWidget).
- **Fix:**
  - Replace onMouseOver/Out with CSS `:hover` and `:focus` states
  - Add `onKeyDown` handlers for interactive elements
  - Add `tabIndex`, `role`, and `aria-label` attributes
  - Add "Skip to main content" link

#### H-FE-4. localStorage for Auth Token (XSS Vulnerable)
- **Files:** `services/api.js` (line 9), `pages/admin/AdminLogin.jsx` (line 17)
- **Issue:** Admin JWT stored in localStorage is vulnerable to XSS attacks. If attacker injects JavaScript, they can steal the token.
- **Fix:** Move token to httpOnly cookie (server-set only). Add CSRF protection for state-changing requests.

#### H-FE-5. No Loading States for Async Operations
- **Files:** `pages/Products.jsx`, `pages/Home.jsx`, `pages/OrderTracking.jsx`
- **Issue:** Products page shows blank until API returns. No loading indicator during coupon validation, order creation, or data fetching.
- **Fix:** Add loading spinners/skeletons consistently. ProductDetail has a good skeleton pattern to follow.

#### H-FE-6. No 404 Page
- **File:** `frontend/src/App.jsx`
- **Issue:** No catch-all route for unknown paths. Navigating to a non-existent URL shows blank content.
- **Fix:** Add `<Route path="*" element={<NotFound />} />` as last route.

#### H-FE-7. Missing SEO on Most Pages
- **Files:** All pages except ProductDetail
- **Issue:** Only ProductDetail uses the SEO component. Home, Products, Cart, Checkout, and all other pages have no `<title>`, description, or OpenGraph tags. No structured data (JSON-LD), robots.txt, or sitemap.
- **Fix:** Add SEO component to every page. Add structured data for products (schema.org).

#### H-FE-8. Mobile Menu Missing Categories
- **File:** `frontend/src/components/layout/Header.jsx` (lines 236-285, 330-366)
- **Issue:** Products mega dropdown is hover-only (desktop). Mobile hamburger menu shows links to pages but no product category submenu. No way to navigate categories on mobile.
- **Fix:** Add category links to mobile dropdown menu.

---

### DevOps/Infrastructure

#### H-DO-1. Containers Run as Root
- **Files:** `backend/Dockerfile`, `frontend/Dockerfile`
- **Issue:** No `USER` directive — both containers run as root user by default.
- **Impact:** Privilege escalation if container is compromised.
- **Fix:**
```dockerfile
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
WORKDIR /app
COPY --chown=nodejs:nodejs . .
USER nodejs
```

#### H-DO-2. No Health Checks in Docker
- **Files:** Both Dockerfiles, `cd/docker-compose.yml`
- **Issue:** No `HEALTHCHECK` directive in Dockerfiles. No health checks in Docker Compose.
- **Impact:** Docker/Kubernetes cannot detect or restart unhealthy containers.
- **Fix:**
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:5000/health || exit 1
```

#### H-DO-3. No .dockerignore Files
- **Files:** Missing `backend/.dockerignore`, `frontend/.dockerignore`
- **Issue:** `node_modules`, `.git`, test files, and logs are copied into Docker images.
- **Impact:** Massive image sizes, slower builds, potential secret leakage.
- **Fix:** Create `.dockerignore` with: `node_modules`, `.git`, `__tests__`, `coverage`, `.env`, `.DS_Store`

#### H-DO-4. Image Vulnerability Scanning Disabled
- **File:** `.github/workflows/ci.yml`
- **Issue:** Trivy image scanning is commented out in CI pipeline.
- **Impact:** Vulnerable images pushed to registry undetected.
- **Fix:** Uncomment Trivy image scan steps.

#### H-DO-5. No Rollback Strategy in Deployment
- **Files:** `cd/deploy.sh`, `.github/workflows/cd.yml`
- **Issue:** Deploy script runs `docker compose down` then `up` without verifying health. No mechanism to restore previous working version on failure.
- **Impact:** Failed deployments leave system in broken state.
- **Fix:** Add health checks post-deploy, backup previous state, auto-rollback on failure.

#### H-DO-6. Missing Nginx Security Headers
- **File:** `frontend/nginx/default.conf`
- **Issue:** No Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options headers.
- **Impact:** Vulnerable to clickjacking, MIME sniffing, XSS.
- **Fix:**
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

#### H-DO-7. No K8s Resource Limits/Requests
- **File:** `helm/nativeharvest/templates/backend-deployment.yaml`, `frontend-deployment.yaml`
- **Issue:** No `resources.requests` or `resources.limits` defined on pods.
- **Impact:** Pods can consume unlimited resources, causing node pressure and eviction of other workloads.
- **Fix:**
```yaml
resources:
  requests:
    cpu: 100m
    memory: 256Mi
  limits:
    cpu: 500m
    memory: 512Mi
```

#### H-DO-8. No Readiness/Liveness Probes in Helm
- **File:** `helm/nativeharvest/templates/backend-deployment.yaml`
- **Issue:** No Kubernetes health probes defined.
- **Impact:** Requests routed to unhealthy pods. Rolling updates proceed even if new pods are unhealthy.
- **Fix:**
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 5000
  initialDelaySeconds: 30
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /health
    port: 5000
  initialDelaySeconds: 10
  periodSeconds: 5
```

#### H-DO-9. No Database in Helm Chart
- **File:** `helm/nativeharvest/templates/`
- **Issue:** No PostgreSQL StatefulSet, Service, or PersistentVolumeClaim in Helm chart. Database is not managed as infrastructure-as-code.
- **Fix:** Add PostgreSQL StatefulSet with PVC, headless Service, liveness/readiness probes.

#### H-DO-10. No Database Migrations
- **Files:** Missing migration directory/tool
- **Issue:** No migration system for schema changes. Manual SQL execution required.
- **Impact:** No version control of schema. Difficult multi-environment deployments. Cannot rollback schema changes.
- **Fix:** Add migration tool (Flyway, db-migrate, or node-pg-migrate).

---

## MEDIUM SEVERITY FINDINGS

### Backend (12)

| # | Issue | File | Fix |
|---|-------|------|-----|
| M-BE-1 | Error messages leak internal details (`err.message` sent to client) | `routes/orders.js:261` | Return generic errors, log details server-side |
| M-BE-2 | No structured logging — `console.log` everywhere, lost in production | Entire backend | Use winston/pino with log levels |
| M-BE-3 | No DB connection pool configuration (size, timeouts) | `config/db.js` | Configure `max: 20`, `idleTimeoutMillis`, `connectionTimeoutMillis` |
| M-BE-4 | No payment idempotency — retries create new Razorpay orders | `routes/payments.js:10-59` | Check existing `razorpay_order_id` before creating |
| M-BE-5 | No audit logging for admin actions (create, update, delete) | Admin route files | Log all admin CRUD with timestamp and identity |
| M-BE-6 | Email injection risk — customer email used in `to` field without validation | `services/emailService.js` | Validate email format strictly before sending |
| M-BE-7 | Hardcoded DB credentials as defaults | `config/db.js:4-6` | Remove defaults, require env vars |
| M-BE-8 | No rate limiting on coupon validation — allows enumeration | `routes/orders.js:12` | Add rate limiter |
| M-BE-9 | Missing HTTP security headers (helmet not used) | `app.js` | Add `app.use(helmet())` |
| M-BE-10 | Temp PDF files not cleaned up on crash | `services/emailService.js:26,153` | Use try-finally for cleanup |
| M-BE-11 | Payment status endpoint publicly accessible without auth | `routes/order-status.js:9-34` | Add email verification |
| M-BE-12 | No API versioning (`/api/` without version prefix) | `app.js` | Use `/api/v1/` prefix |

### Frontend (16)

| # | Issue | File | Fix |
|---|-------|------|-----|
| M-FE-1 | Cart from localStorage not validated — corrupted JSON crashes app | `context/CartContext.jsx` | Wrap `JSON.parse` in try-catch |
| M-FE-2 | `alert()` used for all errors — blocks UI, bad UX | AdminDashboard, Checkout, OrderSuccess | Replace with toast notifications (react-toastify) |
| M-FE-3 | 291 inline style objects — unmaintainable, inconsistent | All pages | Extract to CSS modules or styled-components |
| M-FE-4 | No code splitting — all pages in one bundle | `App.jsx` | Use `React.lazy()` + `Suspense` for routes |
| M-FE-5 | CSS variables defined but hardcoded colors used inline | Throughout | Use `var(--green-dark)` instead of `#2f6f4e` |
| M-FE-6 | Home.jsx is 700 lines with 5 components in one file | `pages/Home.jsx` | Split into HeroSection, TrustHighlights, etc. |
| M-FE-7 | No memoization — 0 uses of `useMemo`, `useCallback`, `React.memo` | Entire codebase | Add where appropriate (scroll handlers, product cards) |
| M-FE-8 | No image optimization — full resolution on mobile, no srcSet, no webp | Product images | Add responsive images with srcSet |
| M-FE-9 | Hardcoded domain in SEO component | `components/SEO.jsx:12` | Use env variable or `window.location.origin` |
| M-FE-10 | No canonical tags for SEO | `components/SEO.jsx` | Add `<link rel="canonical">` |
| M-FE-11 | Checkout form minimal validation — only pincode checked | `pages/Checkout.jsx:49-61` | Add HTML5 validation: `required`, `pattern`, `type="email"` |
| M-FE-12 | Contact page has no actual form — just displays info | `pages/Contact.jsx` | Add contact submission form |
| M-FE-13 | No CSRF protection on state-changing requests | POST/PUT endpoints | Add CSRF token to headers |
| M-FE-14 | Silent API failures — `.catch()` sets empty array, no user feedback | Home.jsx, Products.jsx | Show error message to user |
| M-FE-15 | WhatsApp widget overlaps content on small screens | `components/layout/WhatsAppWidget.jsx` | Adjust positioning for mobile |
| M-FE-16 | Color contrast issues — opacity 0.7 text may fail WCAG AA | Multiple pages | Test with contrast checker, ensure 4.5:1 ratio |

### DevOps (12)

| # | Issue | File | Fix |
|---|-------|------|-----|
| M-DO-1 | No gzip compression in Nginx | `frontend/nginx/default.conf` | Add `gzip on` with types |
| M-DO-2 | No static asset cache headers | `frontend/nginx/default.conf` | Add `expires 1y` for JS/CSS/images |
| M-DO-3 | No rate limiting in Nginx | `frontend/nginx/default.conf` | Add `limit_req_zone` directives |
| M-DO-4 | Missing `.env.example` for developer onboarding | Missing file | Create with all required vars documented |
| M-DO-5 | No linting step in CI | `.github/workflows/ci.yml` | Add ESLint/Prettier check |
| M-DO-6 | No E2E tests in CI | `.github/workflows/ci.yml` | Add Playwright/Cypress |
| M-DO-7 | SonarQube scanning commented out | `.github/workflows/ci.yml` | Uncomment and configure |
| M-DO-8 | No environment-specific builds (dev/staging/prod) | `.github/workflows/ci.yml` | Add environment-based tagging |
| M-DO-9 | No deployment approval gates for production | `.github/workflows/cd.yml` | Add GitHub environment protection rules |
| M-DO-10 | No HPA (Horizontal Pod Autoscaler) in Helm | Helm chart | Add HPA template |
| M-DO-11 | No PDB (Pod Disruption Budget) in Helm | Helm chart | Add PDB template |
| M-DO-12 | No K8s Network Policies — all pods can communicate freely | Helm chart | Add NetworkPolicy restricting traffic |

---

## LOW SEVERITY FINDINGS

### Backend (2)

| # | Issue | File |
|---|-------|------|
| L-BE-1 | Sensitive data logged (Razorpay signatures) | `routes/webhooks.js:62-64` |
| L-BE-2 | JWT token parsing doesn't validate Bearer format | `middleware/auth.js:10-18` |

### Frontend (6)

| # | Issue | File |
|---|-------|------|
| L-FE-1 | `!important` flags overused in media queries | `pages/Home.jsx` |
| L-FE-2 | Inconsistent spacing/sizing (padding: 40px, 60px, 80px) | Multiple pages |
| L-FE-3 | ESLint rules disabled with comments instead of fixing | `Cart.jsx:68`, `OrderTracking.jsx:23` |
| L-FE-4 | 20+ console.log/error calls in production code | Multiple files |
| L-FE-5 | Newsletter form doesn't actually submit to backend | `pages/Home.jsx:576-588` |
| L-FE-6 | Hero carousel doesn't reset timer on manual dot click | `pages/Home.jsx` |

### DevOps (2)

| # | Issue | File |
|---|-------|------|
| L-DO-1 | Duplicate Nginx config at root level (unused) | `Nginx/default.conf` |
| L-DO-2 | Frontend uses Node 18, backend uses Node 22 (version mismatch) | Both Dockerfiles |

---

## ARCHITECTURAL IMPROVEMENTS

### Missing Infrastructure Components

| Component | Priority | Description |
|-----------|----------|-------------|
| Monitoring stack | High | No Prometheus/Grafana for metrics, alerting, and dashboards |
| Centralized logging | High | No ELK/Loki stack for log aggregation and search |
| Secret management | High | No Vault/AWS Secrets Manager integration |
| RBAC for K8s | Medium | No ServiceAccount, Role, or RoleBinding defined |
| Container image signing | Medium | No Cosign/Notary for image provenance verification |
| Backup strategy | High | No automated database backup/restore procedures |
| CDN | Medium | No CloudFront/Cloudflare for static asset delivery |
| WAF | Medium | No Web Application Firewall for attack protection |

### Code Architecture Improvements

| Improvement | Priority | Description |
|-------------|----------|-------------|
| Request validation middleware | High | Create a reusable validation factory instead of per-route validation |
| Error handling middleware | High | Centralized Express error handler instead of per-route try-catch |
| TypeScript migration | Medium | Add type safety to prevent runtime errors |
| Component library | Medium | Extract reusable UI components (ProductCard, ImageCarousel, Toast) |
| API versioning | Low | Prefix routes with `/api/v1/` for future compatibility |
| Feature flags | Low | Add feature flag system for controlled rollouts |

---

## RECOMMENDED ACTION PLAN

### Week 1 — Security (Critical + High Security)
- [ ] Remove hardcoded credentials from `admin.js` and `db.js`
- [ ] Add input validation (joi/zod) to all backend routes
- [ ] Fix file upload validation (type + size)
- [ ] Add rate limiting to admin login and coupon validation
- [ ] Restrict CORS to production domains
- [ ] Fix XSS in SEO endpoint
- [ ] Secure order tracking with email verification
- [ ] Fix containers to run as non-root user

### Week 2 — Reliability (High Reliability + Error Handling)
- [ ] Add React Error Boundary to frontend
- [ ] Fix memory leaks (OrderSuccess interval, unmounted components)
- [ ] Add try/catch to all backend async routes
- [ ] Add health checks to Dockerfiles and Docker Compose
- [ ] Add PostgreSQL service to Docker Compose with persistent volume
- [ ] Create `.dockerignore` files for both frontend and backend
- [ ] Add startup validation for required environment variables

### Week 3 — UX & Accessibility (High UX)
- [ ] Add loading states/spinners to all data-fetching pages
- [ ] Create 404 NotFound page with catch-all route
- [ ] Add keyboard navigation and ARIA labels throughout
- [ ] Replace `alert()` with toast notification system
- [ ] Add SEO meta tags to all pages
- [ ] Fix mobile menu to include product categories
- [ ] Add "Skip to main content" link

### Week 4 — DevOps Hardening
- [ ] Enable Trivy image vulnerability scanning in CI
- [ ] Add deploy script health checks and auto-rollback
- [ ] Add Nginx security headers (CSP, HSTS, X-Frame-Options)
- [ ] Add gzip compression and cache headers to Nginx
- [ ] Add Helm resource limits and readiness/liveness probes
- [ ] Set up database migration tool
- [ ] Create `.env.example` file

### Month 2 — Infrastructure Maturity
- [ ] Add PostgreSQL StatefulSet to Helm chart
- [ ] Implement HPA and PDB in Kubernetes
- [ ] Add Network Policies to Helm chart
- [ ] Set up monitoring stack (Prometheus + Grafana)
- [ ] Set up centralized logging
- [ ] Implement external secret management
- [ ] Add E2E tests to CI pipeline
- [ ] Add SonarQube quality gate

### Month 3 — Code Quality
- [ ] Refactor inline styles to CSS modules
- [ ] Split large components (Home.jsx) into separate files
- [ ] Add code splitting with React.lazy
- [ ] Add memoization where appropriate
- [ ] Consider TypeScript migration
- [ ] Extract reusable component library
- [ ] Add structured logging (winston/pino) to backend
- [ ] Add audit logging for admin actions
