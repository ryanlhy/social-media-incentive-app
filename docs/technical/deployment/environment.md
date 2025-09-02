# Deployment Configuration - EngageReward MVP

## Overview

This document provides the complete deployment configuration for the EngageReward MVP platform, including environment variables, Docker setup, and infrastructure configuration.

## Environment Variables

### Database Configuration
```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/engagereward
DB_HOST=localhost
DB_PORT=5432
DB_NAME=engagereward
DB_USER=postgres
DB_PASSWORD=password
```

### JWT Configuration
```bash
# JWT
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d
```

### Twitter API Configuration
```bash
# Twitter API
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_CALLBACK_URL=https://api.engagereward.app/auth/twitter/callback
```

### Solana Configuration (Helius RPC)
```bash
# Solana (Helius RPC)
HELIUS_RPC_URL=https://rpc.helius.xyz/?api-key=your_helius_api_key
HELIUS_API_KEY=your_helius_api_key
SOLANA_NETWORK=mainnet-beta
PLATFORM_WALLET_PRIVATE_KEY=your_platform_wallet_private_key
HELIUS_DEVNET_RPC_URL=https://rpc.helius.xyz/?api-key=your_helius_api_key&cluster=devnet
```

### Email Configuration
```bash
# Email
EMAIL_PROVIDER=sendgrid
EMAIL_API_KEY=your_email_api_key
FROM_EMAIL=noreply@engagereward.app
SENDGRID_API_KEY=your_sendgrid_api_key
AWS_SES_ACCESS_KEY=your_aws_ses_access_key
AWS_SES_SECRET_KEY=your_aws_ses_secret_key
AWS_SES_REGION=us-east-1
```

### Server Configuration
```bash
# Server
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://engagereward.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Security Configuration
```bash
# Security
ENCRYPTION_KEY=your_encryption_key_here
BCRYPT_SALT_ROUNDS=12
SESSION_SECRET=your_session_secret_here
```

### Monitoring Configuration
```bash
# Monitoring
LOG_LEVEL=info
SENTRY_DSN=your_sentry_dsn
NEW_RELIC_LICENSE_KEY=your_new_relic_key
```

## Docker Configuration

### Dockerfile
```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/engagereward
      - NODE_ENV=production
      - PORT=3000
    depends_on:
      - db
      - redis
    restart: unless-stopped
    networks:
      - engagereward-network

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=engagereward
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - engagereward-network

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - engagereward-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - engagereward-network

volumes:
  postgres_data:
  redis_data:

networks:
  engagereward-network:
    driver: bridge
```

## Nginx Configuration

### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

    server {
        listen 80;
        server_name engagereward.app;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name engagereward.app;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # API rate limiting
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Login rate limiting
        location /api/auth/login {
            limit_req zone=login burst=5 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check
        location /health {
            proxy_pass http://app;
            access_log off;
        }

        # Static files
        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

## Database Initialization

### init.sql
```sql
-- Create database
CREATE DATABASE engagereward;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    user_type ENUM('community_leader', 'community_member') NOT NULL,
    solana_wallet_address VARCHAR(44) UNIQUE,
    twitter_handle VARCHAR(15) UNIQUE,
    twitter_user_id VARCHAR(50),
    twitter_access_token TEXT,
    twitter_refresh_token TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create other tables...
-- (Include all table creation scripts from schema.md)

-- Create indexes
CREATE INDEX idx_users_twitter_handle ON users(twitter_handle);
CREATE INDEX idx_users_solana_address ON users(solana_wallet_address);
-- (Include all indexes from schema.md)

-- Insert initial admin user
INSERT INTO users (email, username, user_type, is_verified, is_active) 
VALUES ('admin@engagereward.app', 'admin', 'community_leader', true, true);
```

## Production Deployment

### AWS Configuration
```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=engagereward-assets
AWS_CLOUDFRONT_DISTRIBUTION_ID=your_cloudfront_distribution_id
```

### Kubernetes Configuration
```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: engagereward-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: engagereward
  template:
    metadata:
      labels:
        app: engagereward
    spec:
      containers:
      - name: app
        image: engagereward/app:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: engagereward-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: engagereward-secrets
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

## Monitoring and Logging

### Health Check Endpoint
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: 'connected' // Check database connection
  };
  
  res.status(200).json(health);
});
```

### Logging Configuration
```javascript
// Winston logger configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'engagereward-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## Security Configuration

### SSL/TLS Setup
```bash
# Generate SSL certificate (Let's Encrypt)
certbot certonly --standalone -d engagereward.app

# Copy certificates to nginx
cp /etc/letsencrypt/live/engagereward.app/fullchain.pem ./nginx/ssl/cert.pem
cp /etc/letsencrypt/live/engagereward.app/privkey.pem ./nginx/ssl/key.pem
```

### Firewall Configuration
```bash
# UFW firewall rules
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

## Backup Configuration

### Database Backup
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="engagereward"

# Create backup
pg_dump $DATABASE_URL > $BACKUP_DIR/backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

### Automated Backup Cron Job
```bash
# Add to crontab
0 2 * * * /path/to/backup.sh
```

## Environment-Specific Configurations

### Development Environment
```bash
# .env.development
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/engagereward_dev
LOG_LEVEL=debug
CORS_ORIGIN=http://localhost:3000
```

### Staging Environment
```bash
# .env.staging
NODE_ENV=staging
DATABASE_URL=postgresql://postgres:password@staging-db:5432/engagereward_staging
LOG_LEVEL=info
CORS_ORIGIN=https://staging.engagereward.app
```

### Production Environment
```bash
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@production-db:5432/engagereward
LOG_LEVEL=warn
CORS_ORIGIN=https://engagereward.app
```

---

*This deployment configuration provides a complete setup for running the EngageReward MVP platform in production. For implementation details and troubleshooting, see the related documentation.*
