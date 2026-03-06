# NativeHarvest - Architecture Document

NativeHarvest is a premium farm-fresh food e-commerce platform for browsing and purchasing agricultural products (pickles, sattu, oils). It includes a customer-facing storefront and an admin panel for product management.

---

## Technology Stack

| Layer              | Technology         | Version     |
|--------------------|--------------------|-------------|
| Frontend           | React              | 18.2.0      |
| Frontend Build     | Vite               | 5.0.0       |
| Frontend Routing   | React Router       | 6.22.3      |
| HTTP Client        | Axios              | 1.6.8       |
| Frontend Server    | Nginx              | Alpine      |
| Backend Framework  | Express.js         | 4.18.2      |
| Backend Runtime    | Node.js            | 18-Alpine   |
| Database           | PostgreSQL         | 15-Alpine   |
| Image Storage      | AWS S3             | SDK v3      |
| Authentication     | JWT                | 9.0.2       |
| Containerization   | Docker             | Multi-stage |
| Orchestration      | Kubernetes (Helm)  | 0.1.0       |
| Testing (Frontend) | Vitest             | 3.2.4       |
| Testing (Backend)  | Jest + Supertest   | 30.2.0      |
| CI/CD              | GitHub Actions     | -           |
| Registry           | Docker Hub         | -           |
| Code Quality       | SonarQube          | -           |
| Security Scanning  | Trivy              | -           |

---

## High-Level Architecture

```
                        +-----------------+
                        |  User Browser   |
                        +--------+--------+
                                 |
                                 v
                   +-------------+--------------+
                   |   Frontend Container (80)   |
                   |   Nginx + React SPA (Vite)  |
                   +---+--------------------+----+
                       |                    |
              Static   |          /api/*    |
              Files    |          Proxy     |
                       v                    v
                                +----------+-----------+
                                | Backend Container    |
                                | Express.js (5000)    |
                                +---+-------------+----+
                                    |             |
                                    v             v
                          +---------+---+   +----+--------+
                          | PostgreSQL  |   |  AWS S3     |
                          | (5432)      |   |  (images)   |
                          +-------------+   +-------------+
```

---

## Project Structure

```
nativeharvest-app/
├── frontend/                   # React SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Layout.jsx      # Main layout wrapper
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── Footer.jsx      # Footer
│   │   │   ├── ProductCard.jsx # Product display card
│   │   │   └── SEO.jsx         # Meta tags (react-helmet-async)
│   │   ├── pages/              # Route-level pages
│   │   │   ├── Home.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── admin/
│   │   │       ├── AdminLogin.jsx
│   │   │       └── AdminDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js          # Axios instance with JWT interceptor
│   │   ├── styles/             # Global CSS
│   │   ├── __tests__/          # Vitest tests
│   │   ├── App.jsx             # Root component with routing
│   │   └── main.jsx            # Entry point
│   ├── public/images/          # Static product images
│   ├── nginx/default.conf      # Nginx config for SPA + API proxy
│   ├── Dockerfile              # Multi-stage: Node build -> Nginx serve
│   ├── vite.config.js
│   └── package.json
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── app.js              # Express app entry point
│   │   ├── config/
│   │   │   ├── db.js           # PostgreSQL pool configuration
│   │   │   └── s3.js           # AWS S3 client initialization
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT verification middleware
│   │   ├── routes/
│   │   │   ├── products.js     # Public product endpoints
│   │   │   ├── admin.js        # Admin login
│   │   │   ├── admin-products.js # Protected product CRUD
│   │   │   ├── admin-upload.js # S3 image upload
│   │   │   └── contact.js      # Contact form
│   │   └── controllers/
│   │       └── contactController.js
│   ├── __tests__/              # Jest + Supertest tests
│   ├── Dockerfile              # Node 18-Alpine
│   └── package.json
├── helm/nativeharvest/         # Kubernetes Helm chart
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── backend-deployment.yaml
│       ├── frontend-deployment.yaml
│       ├── backend-service.yaml
│       ├── frontend-service.yaml
│       ├── ingress.yaml
│       └── secrets.yaml
├── cd/                         # Deployment artifacts
│   ├── docker-compose.yml      # Docker Compose for EC2 deployment
│   └── deploy.sh               # EC2 deploy script
├── Nginx/
│   └── default.conf            # Standalone Nginx config
├── .github/workflows/
│   ├── ci.yml                  # CI pipeline
│   └── cd.yml                  # CD pipeline
├── sonar-project.properties    # SonarQube config
└── README.md
```

---

## Frontend

### Routing

| Path                | Component          | Description              |
|---------------------|--------------------|--------------------------|
| `/`                 | Home               | Landing page             |
| `/products`         | Products           | Product catalog          |
| `/products/:slug`   | ProductDetail      | Single product view      |
| `/about`            | About              | About page               |
| `/contact`          | Contact            | Contact form             |
| `/admin/login`      | AdminLogin         | Admin authentication     |
| `/admin/dashboard`  | AdminDashboard     | Product management (JWT) |

### API Communication

- All API calls go through an Axios instance (`services/api.js`) with base URL `/api`
- An Axios interceptor attaches `Authorization: Bearer <token>` from `localStorage.adminToken`
- Nginx proxies `/api/*` requests to `backend:5000`

### Docker Build (Multi-stage)

1. **Stage 1 (Node 18-Alpine):** `npm run build` produces static files in `/app/dist`
2. **Stage 2 (Nginx-Alpine):** Serves the SPA and proxies API requests to the backend

---

## Backend

### API Endpoints

| Method | Route                    | Auth | Description             |
|--------|--------------------------|------|-------------------------|
| GET    | `/api/products`          | No   | List all products       |
| GET    | `/api/products/:slug`    | No   | Get product by slug     |
| POST   | `/api/admin/login`       | No   | Admin login (returns JWT) |
| POST   | `/api/admin/products`    | JWT  | Create product          |
| PUT    | `/api/admin/products/:slug` | JWT | Update product       |
| DELETE | `/api/admin/products/:slug` | JWT | Delete product       |
| POST   | `/api/admin/upload`      | JWT  | Upload image to S3      |
| POST   | `/api/contact`           | No   | Submit contact form     |
| GET    | `/health`                | No   | Health check            |

### Database Schema

PostgreSQL with a single `products` table:

```sql
CREATE TABLE products (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  price       INTEGER NOT NULL,
  image       TEXT,
  description TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Authentication

- Admin credentials validated against `ADMIN_EMAIL` / `ADMIN_PASSWORD` environment variables
- On success, a JWT is signed with `JWT_SECRET` (1-day expiry)
- Protected routes use the `auth.js` middleware to verify the Bearer token

### Image Storage (AWS S3)

- Bucket: `nativeharvest-images`
- Upload path: `products/{timestamp}-{filename}`
- Multer handles multipart file uploads before passing to S3

---

## Nginx

The frontend container runs Nginx with the following behavior:

- **`/`** — Serves the React SPA with `try_files $uri /index.html` for client-side routing
- **`/api/*`** — Reverse proxy to `http://backend:5000`, forwarding `Host`, `X-Real-IP`, and `Authorization` headers

A standalone Nginx config exists at `Nginx/default.conf` with identical behavior.

---

## Kubernetes Deployment (Helm)

**Chart:** `helm/nativeharvest` (v0.1.0, appVersion 1.0.0)

### Resources

| Resource   | Name                       | Details                         |
|------------|----------------------------|---------------------------------|
| Deployment | nativeharvest-backend      | Configurable replicas, port 5000 |
| Deployment | nativeharvest-frontend     | Configurable replicas, port 80   |
| Service    | nativeharvest-backend-svc  | ClusterIP, port 5000            |
| Service    | nativeharvest-frontend-svc | ClusterIP, port 80              |
| Ingress    | nativeharvest-ingress      | Nginx class, host-based routing |
| Secret     | nativeharvest-secrets      | JWT, DB credentials             |

### Default Values

```yaml
environment: dev
frontend:
  replicas: 1
  port: 80
backend:
  replicas: 1
  port: 5000
service:
  type: ClusterIP
ingress:
  enabled: true
  className: nginx
  host: nativeharvest.local
```

Backend pods receive database and JWT secrets via environment variables injected from the Kubernetes Secret.

---

## CI/CD Pipeline

### CI (`.github/workflows/ci.yml`)

Triggered on push to `main`, `develop`, `release/*`, or on pull requests.

| Job             | Description                                          |
|-----------------|------------------------------------------------------|
| Backend Tests   | `npm test -- --ci --coverage` (Node 18)              |
| Frontend Tests  | `npm test -- --run` (Vitest)                         |
| Security Scan   | Trivy filesystem scan (fails on HIGH/CRITICAL)       |
| Docker Build    | Builds and pushes images to Docker Hub tagged with `github.sha` |

Images are pushed as:
- `samarthr8/nativeharvest-frontend:<sha>`
- `samarthr8/nativeharvest-backend:<sha>`

### CD (`.github/workflows/cd.yml`)

Triggered on successful CI completion:

1. SSH into EC2 instance
2. Execute `deploy.sh <sha>` which:
   - Stops running containers (`docker compose down`)
   - Pulls new images
   - Starts updated containers (`docker compose up -d`)
   - Prunes unused Docker resources

---

## Docker Compose (EC2 Deployment)

**File:** `cd/docker-compose.yml`

```
Services:
  - frontend  (port 80:80, image tagged by IMAGE_TAG)
  - backend   (port 5000, image tagged by IMAGE_TAG)

Network: nativeharvest-net (bridge)
Env: loaded from .env file
Restart: always
```

---

## Environment Variables

### Backend

| Variable         | Default                      | Description              |
|------------------|------------------------------|--------------------------|
| `DB_HOST`        | `postgres`                   | PostgreSQL host          |
| `DB_USER`        | `nhuser`                     | Database user            |
| `DB_PASSWORD`    | `nhpassword`                 | Database password        |
| `DB_NAME`        | `nativeharvest`              | Database name            |
| `ADMIN_EMAIL`    | `admin@nativeharvest.in`     | Admin login email        |
| `ADMIN_PASSWORD` | `StrongAdmin123`             | Admin login password     |
| `JWT_SECRET`     | `nativeharvestsecret`        | JWT signing secret       |
| `AWS_ACCESS_KEY_ID`     | -                     | AWS credentials for S3   |
| `AWS_SECRET_ACCESS_KEY` | -                     | AWS credentials for S3   |
| `S3_BUCKET_NAME` | `nativeharvest-images`       | S3 bucket for images     |

### GitHub Actions Secrets

| Secret              | Purpose                    |
|---------------------|----------------------------|
| `DOCKERHUB_USERNAME`| Docker Hub authentication  |
| `DOCKERHUB_TOKEN`   | Docker Hub authentication  |
| `EC2_HOST`          | EC2 instance address       |
| `EC2_SSH_KEY`       | SSH private key for deploy |

---

## Component Communication Flow

1. **Browser** requests the React SPA from the frontend container (Nginx on port 80)
2. Nginx serves static files for all non-API routes, falling back to `index.html` for SPA routing
3. API requests (`/api/*`) are proxied by Nginx to the **backend** container on port 5000
4. The backend queries **PostgreSQL** for product data
5. Image uploads are stored in **AWS S3** and the URL is saved in the database
6. Admin routes require a valid **JWT** obtained via `/api/admin/login`
7. The frontend stores the JWT in `localStorage` and attaches it to requests via an Axios interceptor
