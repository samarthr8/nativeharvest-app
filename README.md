# NativeHarvest 🌾

**Premium farm-fresh food platform** built with **React, Node.js, PostgreSQL, Docker & Nginx**

---

## 🔧 Prerequisites

- Ubuntu 20.04 / 22.04 EC2 instance  
- Open ports:
  - `22` (SSH)
  - `80` (HTTP)

---

## 🐳 1. Install Docker

```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
```

⚠️ Important

Logout and login again for Docker permissions to apply.
```bash
logout
```

📦 2. Clone Repository
```bash
git clone https://github.com/samarthr8/nativeharvest.git
cd nativeharvest
```

🌐 3. Create Docker Network

All containers communicate using this network.
```bash
docker network create nativeharvest-net
```

🗄️ 4. Start PostgreSQL (DATABASE FIRST)
```bash
docker run -d \
  --name postgres \
  --network nativeharvest-net \
  -e POSTGRES_DB=nativeharvest \
  -e POSTGRES_USER=nhuser \
  -e POSTGRES_PASSWORD=nhpassword \
  -p 5432:5432 \
  postgres:15-alpine
```

🧱 5. Initialize Database Schema
Enter PostgreSQL shell
```bash
docker exec -it postgres psql -U nhuser -d nativeharvest
```

Run SQL
```bash
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price INTEGER NOT NULL,
  image TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO products (name, slug, price, image, description)
VALUES
('Mango Pickle', 'mango-pickle', 299, '/images/products/mango-pickle.jpg',
 'Traditional mango pickle made using sun-ripened mangoes and mustard oil'),
('Amla Pickle', 'amla-pickle', 279, '/images/products/amla-pickle.jpg',
 'Rich in Vitamin C, prepared using traditional methods'),
('Sattu', 'sattu', 199, '/images/products/sattu.jpg',
 'Stone-ground roasted gram flour, high in protein'),
('Sarson Oil', 'sarson-oil', 399, '/images/products/sarson-oil.jpg',
 'Cold-pressed mustard oil extracted traditionally');
```
Exit psql
```bash
\q
```

⚙️ 6. Build & Run Backend (Node.js API)
```bash
docker build -t nativeharvest-backend backend
docker run -d \
  --name backend \
  --network nativeharvest-net \
  -e ADMIN_EMAIL=admin@nativeharvest.in \
  -e ADMIN_PASSWORD=StrongAdmin123 \
  -e JWT_SECRET=SuperSecretKey \
  -e DB_HOST=postgres \
  -e DB_USER=nhuser \
  -e DB_PASSWORD=nhpassword \
  -e DB_NAME=nativeharvest \
  nativeharvest-backend
```

🎨 7. Build & Run Frontend (React + Nginx)
```bash
docker build -t nativeharvest-frontend frontend
docker run -d \
  --name frontend \
  --network nativeharvest-net \
  -p 80:80 \
  nativeharvest-frontend
```

✅ 8. Verify Deployment
🌍 Website
```bash
http://<EC2_PUBLIC_IP>
```

🔌 API
```bash
http://<EC2_PUBLIC_IP>/api/products
```

🔐 Admin Panel
```bash
http://<EC2_PUBLIC_IP>/admin/login
```

Admin Credentials
```bash
Email: admin@nativeharvest.in
Password: StrongAdmin123
```

🔁 Useful Commands
Restart backend
```bash
docker restart backend
```

View logs
```bash
docker logs backend
docker logs frontend
```

🚀 Architecture Overview
```bash
Frontend: React (served via Nginx)

Backend: Node.js + Express

Database: PostgreSQL

Authentication: JWT (admin)

Infrastructure: Docker, custom Docker network
```
