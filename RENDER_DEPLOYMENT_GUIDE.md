# Directus Deployment to Render Guide

This guide will help you deploy your custom Directus instance to Render while keeping your Railway deployment intact.

## 🎯 Overview

You now have:
- ✅ **Railway deployment** (existing, untouched)
- 🆕 **Render deployment** (new, separate environment)
- 🔧 **Render MCP server** configured for management

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your Directus repo should be accessible to Render
3. **Render API Key**: For the MCP server (optional but recommended)

## 🚀 Deployment Options

### Option 1: Infrastructure as Code (Recommended)

Using the `render.yaml` file I created:

1. **Connect Repository**:
   ```bash
   # Push the new files to your repo
   git add render.yaml Dockerfile.render scripts/ RENDER_DEPLOYMENT_GUIDE.md
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Create New Service on Render**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the branch (create a `render-deploy` branch if you want separation)
   - Render will automatically detect the `render.yaml`

3. **Configure Environment Variables**:
   The following will be auto-generated or set by Render:
   - ✅ `DATABASE_URL` (from PostgreSQL service)
   - ✅ `PORT` (set to 10000)
   - ✅ `KEY` & `SECRET` (auto-generated)
   
   You may want to customize:
   - `ADMIN_EMAIL`: Your admin email (set to your email)
   - `PUBLIC_URL`: Update to your actual Render URL after deployment

### Option 2: Manual Docker Deployment

Using the `Dockerfile.render`:

1. **Create Web Service**:
   - New → Web Service
   - Connect GitHub repository
   - Runtime: Docker
   - Dockerfile path: `Dockerfile.render`

2. **Environment Variables**:
   Add these in Render dashboard:
   ```
   NODE_ENV=production
   PORT=10000
   DATABASE_URL=[PostgreSQL connection string]
   KEY=[generate random 32-char string]
   SECRET=[generate random 32-char string]
   ADMIN_EMAIL=meet.tamamat@gmail.com
   ADMIN_PASSWORD=[strong password]
   ```

## 🗄️ Database Setup

Your deployment includes a PostgreSQL database:

- **Automatic**: If using `render.yaml`, database is created automatically
- **Manual**: Create new PostgreSQL database in Render dashboard

### Database Migration

After deployment, your Directus will need to initialize:

1. First startup will create all tables automatically
2. Your existing data from Railway stays separate
3. You can migrate data later if needed using Directus exports/imports

## 🔧 MCP Server Configuration

I've configured a Render MCP server for you:

```json
"render": {
  "command": "npx",
  "args": ["@render/mcp-server"],
  "env": {
    "RENDER_API_KEY": ""
  }
}
```

To use it:
1. Get your Render API key from [Account Settings](https://dashboard.render.com/account)
2. Set the `RENDER_API_KEY` environment variable
3. The MCP server will allow you to manage your Render services directly from Claude Code

## 🌐 Post-Deployment Steps

### 1. Access Your Directus Instance
- URL will be: `https://your-service-name.onrender.com`
- First visit will prompt for initial admin setup (if not set via env vars)

### 2. Configure Your Directus
- Log in with your admin credentials
- Import your schema from Railway if needed
- Configure file storage, email, etc.

### 3. Update Environment Variables
Update these in Render dashboard after deployment:
- `PUBLIC_URL`: Set to your actual Render URL
- `CORS_ORIGIN`: Add your frontend domains

### 4. Test MCP Integration
```bash
# Test the MCP server connection
claude --mcp-servers
# Should show "render" in the list
```

## 🔄 Managing Both Deployments

### Railway (Production)
- Keep your current setup unchanged
- Continue using for production traffic
- All existing data and configurations remain

### Render (Staging/Testing)
- New clean environment
- Perfect for testing changes
- Can be used as backup deployment

### Syncing Changes
To deploy changes to both environments:

```bash
# Deploy to Railway (your existing process)
git push railway main

# Deploy to Render
git push origin main  # Triggers Render rebuild
```

## 🛠️ Troubleshooting

### Build Issues
- Check Node.js version is 22+ in Render settings
- Verify pnpm installation in build logs
- Ensure all workspace packages build correctly

### Database Connection
- Verify DATABASE_URL format: `postgresql://user:password@host:port/database`
- Check firewall settings between services

### MCP Server Issues
- Install Render MCP server: `npm install -g @render/mcp-server`
- Verify API key has correct permissions
- Check MCP server logs in Claude Code

## 📞 Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Directus Documentation**: [docs.directus.io](https://docs.directus.io)
- **MCP Documentation**: Available in Claude Code help

## 🎉 Next Steps

1. **Deploy to Render** using Option 1 or 2
2. **Test your Directus instance** 
3. **Configure the MCP server** with your API key
4. **Set up your content** and test functionality
5. **Consider using Render as staging** environment for testing changes

Your Railway deployment remains completely untouched and operational! 🚀