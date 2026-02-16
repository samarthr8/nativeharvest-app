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

🔐 SSL Termination (Production Setup)
```bash
This project uses SSL termination at the EC2 host level, not inside Docker containers.
This follows industry best practices for maintainability, security, and scalability.
```
🏗 Architecture Overview
```bash
Internet (HTTPS)
   ↓
EC2 Host Nginx (SSL termination)
   ↓
Docker containers (HTTP only)
```
SSL certificates are managed on the EC2 host

Docker containers remain stateless and immutable

No certificates are stored inside containers

✅ Why SSL Is Terminated on Host Nginx
```bash
Easier certificate renewal (Certbot)

No container rebuilds on certificate changes

Prevents certificate loss on container recreation

Production-grade and Kubernetes-ready design
```
🛠 Steps to Enable SSL Termination
```bash
1. Install Nginx on EC2 Host
sudo apt update
sudo apt install nginx -y
```
2. Create Nginx Reverse Proxy Configuration
```bash
sudo nano /etc/nginx/sites-available/nativeharvest
```
```bash
server {
    server_name nativeharvest.store www.nativeharvest.store;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header Authorization $http_authorization;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/nativeharvest /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

3. Install SSL Certificate (Let’s Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d nativeharvest.store -d www.nativeharvest.store
```

Choose the option to redirect HTTP → HTTPS.

4. Auto-Renew Certificates
```bash
sudo crontab -e
```

Add:
```bash
0 3 * * * certbot renew --quiet
```

🔒 Notes

SSL is terminated at the edge (EC2 host)

Docker containers continue to serve HTTP traffic internally

Authorization headers must be explicitly forwarded for admin APIs

✅ Result:
The application is accessible securely via https://nativeharvest.store.