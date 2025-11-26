# Vercel Deployment Guide

## ✅ Prerequisites Completed

Your project is **production-ready** with:
- ✅ Production build successful (zero errors)
- ✅ All routes configured (15 routes total)
- ✅ MongoDB Atlas configured with URL-encoded connection string
- ✅ Super admin credentials seeded (Email: superadmin@institute.com)
- ✅ GitHub repository initialized and up to date
- ✅ vercel.json configuration added

**GitHub Repository:**
```
https://github.com/iamthirukkumaran/login-portal
```

---

## Quick Deployment (2 Steps)

### Step 1: Connect to Vercel (Dashboard Method - RECOMMENDED)

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click **"New Project"**
4. Select **"Import Git Repository"**
5. Find and select `login-portal` repository
6. Click **"Import"**

### Step 2: Add Environment Variables

In the Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://formDB:Thiru%402772@cluster0.fw2eylb.mongodb.net/?appName=Cluster0` |
| `JWT_SECRET` | `your-secret-key-here` |

3. Click **"Save"**
4. Click **"Deploy"**

---

## Alternative: Deploy via CLI

If you prefer the command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to staging
vercel

# Deploy to production
vercel --prod
```

---

## After Deployment

### 1. Access Your Application

Your app will be available at:
```
https://[project-name].vercel.app
```

### 2. First Login

Use the super admin credentials:
- **Email:** superadmin@institute.com
- **Password:** SuperAdmin@123

⚠️ **IMPORTANT:** Change the super admin password immediately after first login!

### 3. Verify All Features

✓ Login to dashboard
✓ View students list
✓ Edit student profile
✓ Manage fees
✓ Record payments
✓ View payment history

---

## Environment Variables Explained

### MONGODB_URI
Connection string to your MongoDB Atlas database. Make sure:
- Special characters are URL-encoded (@ → %40)
- Connection string includes `?appName=Cluster0`
- Database name: `formDB`

### JWT_SECRET
Secret key for JWT token generation. Can be any strong string:
```
Example: "your-super-secret-key-that-is-very-long-and-random-2024"
```

---

## Deployment Troubleshooting

### Issue: Build Fails
**Solution:** Check the build logs in Vercel dashboard:
1. Go to your project → Deployments
2. Click on failed deployment
3. View Build Logs tab
4. Common fixes:
   - Ensure all environment variables are set
   - Check MongoDB connection string format
   - Verify Node.js version matches (18.x)

### Issue: Database Connection Error
**Solution:**
1. Verify MongoDB connection string in Vercel environment variables
2. Ensure @ symbol is encoded as %40
3. Check MongoDB Atlas IP whitelist includes Vercel IPs (or set to 0.0.0.0/0)

### Issue: Authentication Not Working
**Solution:**
1. Verify JWT_SECRET is set in Vercel
2. Check super admin exists in database
3. Run `npm run seed-admin` locally to reseed if needed

### Issue: Routes Return 404
**Solution:**
1. Verify all routes were compiled (check build logs)
2. Clear Vercel cache: Project Settings → Git → Redeploy
3. Ensure no routes are commented out

---

## MongoDB Atlas Whitelist Setup

To ensure database access from Vercel:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Login to your account
3. Select your cluster → **Network Access**
4. Click **"Add IP Address"**
5. Enter `0.0.0.0/0` to allow all IPs (for development)
   - For production: Use Vercel's IP addresses
6. Click **"Confirm"**

---

## Custom Domain Setup (Optional)

1. Go to Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (usually 24 hours)

---

## Monitoring & Logs

### View Real-time Logs
```bash
vercel logs [project-name] --prod
```

### View in Vercel Dashboard
1. Go to your project
2. Click **"Deployments"** tab
3. Select any deployment
4. View **"Logs"** tab

---

## Rollback a Deployment

If something goes wrong:

1. Go to **Deployments** tab
2. Find the previous working deployment
3. Click the three dots menu
4. Select **"Promote to Production"**

---

## Production Checklist

- [ ] ✅ Environment variables configured
- [ ] ✅ MongoDB connection verified
- [ ] ✅ Super admin login working
- [ ] ✅ All features tested
- [ ] ✅ Super admin password changed
- [ ] ✅ Custom domain configured (optional)
- [ ] ✅ Error monitoring set up
- [ ] ✅ Database backups configured

---

## Helpful Resources

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas/docs
- **Environment Variables:** https://vercel.com/docs/projects/environment-variables

---

## Support

For issues:
1. Check Vercel build logs
2. Review MongoDB Atlas connection
3. Verify environment variables
4. Check browser console for client-side errors
5. Review application logs in Vercel

---

**Deployment Status:** ✅ Ready for Production

Your application is fully optimized and ready to serve thousands of users!
