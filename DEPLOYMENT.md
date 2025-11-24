# Deployment Guide - FreshHarvest

## Overview

FreshHarvest can be deployed on multiple platforms. This guide covers the most popular options.

---

## Option 1: Deploy to Replit (Easiest)

### Prerequisites
- GitHub account with your repository
- Replit account (free tier available)
- Stripe account (sandbox mode)

### Steps

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Replit**
   - Go to https://replit.com
   - Click "Import from GitHub"
   - Select your repository
   - Replit auto-detects Node.js + PostgreSQL

3. **Set Environment Variables**
   - Click "Secrets" (lock icon)
   - Add all variables from `.env`:
     ```
     DATABASE_URL=postgresql://...
     STRIPE_SECRET_KEY=sk_...
     STRIPE_PUBLISHABLE_KEY=pk_...
     SESSION_SECRET=random_string
     NODE_ENV=production
     ```

4. **Deploy Database**
   - Replit provides PostgreSQL automatically
   - Run in Shell: `npm run db:push`
   - Database is created and ready

5. **Start Application**
   - Click "Run" button
   - Replit builds and deploys
   - Get live URL (e.g., `https://app-name.replit.dev`)

6. **Configure Stripe Webhooks**
   - Go to https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://your-app.replit.dev/webhooks/stripe`
   - Events: `checkout.session.completed`, `charge.refunded`

---

## Option 2: Deploy to Vercel (Frontend) + Railway (Backend)

### Frontend Deployment (Vercel)

1. **Build frontend**
   ```bash
   npm run build
   ```

2. **Connect Vercel**
   - Go to https://vercel.com
   - Import from GitHub
   - Set build command: `npm run build`
   - Output directory: `dist`

3. **Environment Variables (Vercel)**
   - Add: `VITE_STRIPE_PUBLISHABLE_KEY`
   - Add: `VITE_API_URL=https://your-backend.railway.app`

### Backend Deployment (Railway)

1. **Create Railway Project**
   - Go to https://railway.app
   - New Project → GitHub Repo
   - Select your repository

2. **Add PostgreSQL Plugin**
   - Click "Add Service"
   - Select "PostgreSQL"
   - Auto-configured with DATABASE_URL

3. **Set Environment Variables**
   - Add all from `.env` (except DATABASE_URL)
   - Railway provides DATABASE_URL automatically

4. **Deploy**
   - Push to main branch
   - Railway auto-deploys
   - Get backend URL from deployments

---

## Option 3: Deploy to Heroku (Traditional)

### Prerequisites
- Heroku account (credit card required)
- Heroku CLI installed

### Steps

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

2. **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set SESSION_SECRET=your_random_secret
   heroku config:set STRIPE_SECRET_KEY=sk_...
   heroku config:set STRIPE_PUBLISHABLE_KEY=pk_...
   ```
   DATABASE_URL is auto-created by addon.

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Run Migrations**
   ```bash
   heroku run npm run db:push
   ```

---

## Option 4: Deploy to AWS (Enterprise)

### EC2 + RDS + Lambda Setup

1. **EC2 Instance**
   - Launch Ubuntu 20.04 instance
   - Install Node.js and npm
   - Clone repository
   - Install dependencies

2. **RDS Database**
   - Create PostgreSQL RDS instance
   - Set security groups for EC2 access
   - Update DATABASE_URL

3. **Application Setup**
   ```bash
   npm install
   npm run build
   npm run db:push
   ```

4. **Start with PM2**
   ```bash
   npm install -g pm2
   pm2 start npm -- run dev
   pm2 startup
   pm2 save
   ```

5. **Setup Reverse Proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
       }
   }
   ```

6. **Enable HTTPS (Let's Encrypt)**
   ```bash
   sudo apt install certbot
   sudo certbot certonly --nginx -d your-domain.com
   ```

---

## Option 5: Deploy to Azure (Microsoft)

### App Service + Azure Database

1. **Create Resource Group**
   ```bash
   az group create --name fresh-harvest --location eastus
   ```

2. **Create App Service Plan**
   ```bash
   az appservice plan create --name fresh-harvest-plan \
     --resource-group fresh-harvest --sku B1
   ```

3. **Deploy Application**
   ```bash
   az webapp up --name fresh-harvest-app \
     --resource-group fresh-harvest --runtime "node|18"
   ```

4. **Setup Database**
   - Create Azure Database for PostgreSQL
   - Connection string: `postgresql://user:pass@server.postgres.database.azure.com/db`

5. **Configure App Settings**
   ```bash
   az webapp config appsettings set --name fresh-harvest-app \
     --resource-group fresh-harvest \
     --settings DATABASE_URL="..." STRIPE_SECRET_KEY="..."
   ```

---

## Post-Deployment Checklist

- [ ] Update Stripe keys to production keys (not test)
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure domain name
- [ ] Setup Stripe webhooks for production
- [ ] Configure CORS properly for production domain
- [ ] Enable database backups
- [ ] Setup error monitoring (Sentry, LogRocket)
- [ ] Configure email notifications
- [ ] Setup monitoring and alerts
- [ ] Implement rate limiting
- [ ] Add security headers
- [ ] Run security audit
- [ ] Load testing
- [ ] Document deployment process

---

## Production Environment Variables

```env
NODE_ENV=production
PORT=5000

# Database (provided by platform)
DATABASE_URL=postgresql://...

# Stripe (Use PRODUCTION keys, not test)
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY

# Session (Change to strong random value)
SESSION_SECRET=your_strong_production_secret_min_32_chars

# Optional: Replit Auth (for Replit deployment)
REPLIT_CLIENT_ID=your_production_client_id
REPLIT_CLIENT_SECRET=your_production_secret
REPLIT_AUTH_REDIRECT_URI=https://your-app-domain.com/auth/callback
```

---

## Monitoring & Maintenance

### Performance Monitoring
- Use Datadog or New Relic
- Monitor response times
- Track database query performance
- Monitor error rates

### Error Tracking
- Integrate Sentry for error reporting
- Setup error alerts
- Track user impact

### Backup Strategy
- Automated daily database backups
- Test restore process weekly
- Keep backups for 30 days minimum

### Security Updates
- Keep dependencies updated
- Run `npm audit` regularly
- Monitor security advisories
- Update Node.js runtime

---

## Scaling Considerations

### Database
- Setup read replicas for high traffic
- Use connection pooling (PgBouncer)
- Monitor slow queries
- Optimize indexes

### Application
- Use caching (Redis)
- Implement CDN for static assets
- Load balancing across instances
- Use Docker for consistency

### Storage
- Use object storage (S3) for product images
- Cache images with CDN
- Optimize image sizes

---

## Cost Optimization

- **Replit:** Free tier available, pay-as-you-go
- **Heroku:** $7-50/month minimum
- **Railway:** Pay per usage (~$5-50/month)
- **Vercel:** Free for frontend, ~$20/month for backend
- **AWS:** Variable, typically $20-200/month
- **Azure:** Pay per usage, ~$15-100/month

---

## Troubleshooting Deployment

### Database Connection Failed
- Verify DATABASE_URL format
- Check network security groups
- Ensure database is running
- Test connection: `psql $DATABASE_URL`

### Stripe Webhooks Not Working
- Verify webhook URL is correct
- Check webhook events in Stripe dashboard
- Ensure POST method is allowed
- Check response status codes

### Application Won't Start
- Check logs: `npm run dev` (local test first)
- Verify all environment variables are set
- Run migrations: `npm run db:push`
- Check Node.js version compatibility

### Performance Issues
- Check database query logs
- Monitor CPU and memory usage
- Enable caching where possible
- Optimize image sizes
- Use CDN for static assets

---

## Support & Documentation

- **Replit Docs:** https://docs.replit.com/
- **Railway Docs:** https://railway.app/docs
- **Heroku Docs:** https://devcenter.heroku.com/
- **Vercel Docs:** https://vercel.com/docs
- **AWS Docs:** https://docs.aws.amazon.com/
- **Azure Docs:** https://docs.microsoft.com/azure/

---

**Happy deploying!** 🚀
