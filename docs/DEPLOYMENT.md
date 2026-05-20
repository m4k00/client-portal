# Deployment Guide

## Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account
- Neon PostgreSQL database
- Anthropic API key
- Resend API key
- Upstash Redis database

### Steps

1. **Prepare External Services**

   **Neon (PostgreSQL):**
   - Go to https://neon.tech
   - Create a new project
   - Copy the connection string

   **Anthropic:**
   - Go to https://console.anthropic.com
   - Create an API key
   - Copy it

   **Resend:**
   - Go to https://resend.com
   - Create an API key
   - Copy it

   **Upstash (Redis):**
   - Go to https://upstash.com
   - Create a Redis database
   - Copy the REST URL and token

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/yourusername/client-portal.git
   git push -u origin main
   ```

3. **Import to Vercel**
   - Go to https://vercel.com/new
   - Import your repository
   - Click "Deploy"

4. **Add Environment Variables**
   In Vercel dashboard → Settings → Environment Variables, add:

   ```
   DATABASE_URL=postgresql://...
   AUTH_SECRET=<generate with: openssl rand -base64 32>
   AUTH_URL=https://your-app.vercel.app
   ANTHROPIC_API_KEY=sk-ant-...
   RESEND_API_KEY=re_...
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   ADMIN_EMAIL=your-email@example.com
   ADMIN_PASSWORD=your-secure-password
   ```

5. **Redeploy** (to pick up environment variables)
   - Go to Deployments → Click "..." → Redeploy

6. **Run Database Migration**
   After deployment, run locally or in Vercel CLI:
   ```bash
   npm run db:push
   ```

7. **Create Admin User**
   ```bash
   npm run db:seed
   ```

8. **Test**
   - Visit your Vercel URL
   - Complete a test submission at `/intake`
   - Log in at `/admin` with your admin credentials
   - Verify email notifications work

---

## Self-Hosted Deployment

### Via Docker (Coming Soon)
A Dockerfile will be added in a future update.

### Via Node.js

1. **Clone and build:**
   ```bash
   git clone https://github.com/yourusername/client-portal.git
   cd client-portal
   npm install
   npm run build
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Run migrations:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start:**
   ```bash
   npm start
   ```

5. **Use a process manager (PM2):**
   ```bash
   npm install -g pm2
   pm2 start npm --name "client-portal" -- start
   pm2 save
   pm2 startup
   ```

6. **Set up reverse proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Set up SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## Post-Deployment Checklist

- [ ] Test form submission on production URL
- [ ] Verify AI assessment generates correctly
- [ ] Confirm admin login works
- [ ] Check email notifications arrive
- [ ] Test rate limiting (3 submissions from same IP)
- [ ] Verify mobile responsiveness
- [ ] Check all admin dashboard features
- [ ] Set up monitoring (Vercel Analytics or custom)
- [ ] Update `AUTH_URL` if domain changes

---

## Troubleshooting

### Assessment not generating
- Check `ANTHROPIC_API_KEY` is set correctly
- Check API key has credits/is active
- Check Vercel logs for errors

### Email not sending
- Verify `RESEND_API_KEY` is correct
- Check domain is verified in Resend (or use their test domain)
- Check `ADMIN_EMAIL` is set

### Rate limiting not working
- Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set
- Check Redis database is active
- If not critical, rate limiting will fail gracefully (allow requests)

### Database connection errors
- Verify `DATABASE_URL` is correct
- Check Neon project is not paused (free tier pauses after inactivity)
- Ensure IP is allowlisted (Neon allows all by default)

---

## Security Recommendations

1. **Change default admin password** after first login
2. **Rotate** `AUTH_SECRET` periodically
3. **Monitor** API usage (Anthropic, Resend, Upstash)
4. **Set up alerts** for failed logins or unusual activity
5. **Keep dependencies updated**: `npm audit fix`

---

## Monitoring & Analytics

### Vercel Analytics (Built-in)
- Enable in Vercel dashboard → Analytics
- Track page views, performance, Web Vitals

### Custom Monitoring
- Add Sentry for error tracking
- Add PostHog for product analytics
- Monitor API costs (Anthropic, Resend)

---

## Backup Strategy

1. **Database:** Neon handles backups automatically (free tier: 7 days retention)
2. **Manual backup:**
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```
3. **Restore:**
   ```bash
   psql $DATABASE_URL < backup.sql
   ```

---

## Scaling Considerations

For high traffic (100+ submissions/day):
- Upgrade Neon tier for better performance
- Consider moving AI assessment to a background job (e.g., Inngest, BullMQ)
- Add Vercel Pro for better rate limits and performance
- Monitor Anthropic API costs (Sonnet 4 is $3/$15 per million tokens)

---

For support or questions, open an issue on GitHub.
