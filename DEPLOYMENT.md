# Deployment Guide - Branding Compliance Assistant

This guide covers deploying the Branding Compliance Assistant to GitHub Pages.

## 🚀 Quick Setup

### 1. Repository Setup
```bash
# Run the setup script
./setup-github.sh

# Or manually create repository and run:
git remote add origin https://github.com/YOUR_USERNAME/branding-compliance-assistant.git
git branch -M main
git push -u origin main
```

### 2. Update Configuration
Replace `YOUR_USERNAME` in these files with your GitHub username:

**package.json**:
```json
{
  "repository": {
    "url": "https://github.com/YOUR_USERNAME/branding-compliance-assistant.git"
  },
  "homepage": "https://YOUR_USERNAME.github.io/branding-compliance-assistant"
}
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section
4. Select **Source**: "GitHub Actions"
5. Save the settings

### 4. Automatic Deployment
The GitHub Actions workflow will automatically:
- Run tests on every push
- Build the application
- Deploy to GitHub Pages
- Update the live site

## 🔧 Manual Commands

### Create Repository Manually
```bash
# Initialize repository
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Branding Compliance Assistant"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/branding-compliance-assistant.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Update Repository URLs
```bash
# Edit package.json to replace YOUR_USERNAME with your actual GitHub username
# Then commit the changes
git add package.json
git commit -m "Update repository URLs with actual username"
git push
```

## 📱 GitHub Pages Configuration

### Repository Settings
1. **Settings** → **General**
   - Repository name: `branding-compliance-assistant`
   - Description: "Real-time branding compliance checker"
   - Visibility: Public

2. **Settings** → **Pages**
   - Source: GitHub Actions
   - Custom domain: (optional)

3. **Settings** → **Actions**
   - Actions permissions: "Allow all actions"

### Workflow File
The `.github/workflows/ci.yml` file automatically handles:
- Testing on multiple Node.js versions
- Building the application
- Deploying to GitHub Pages

## 🌐 Live Deployment

### Access Your App
Once deployed, your app will be available at:
```
https://YOUR_USERNAME.github.io/branding-compliance-assistant
```

### First Deployment
1. Push initial code to GitHub
2. Wait for GitHub Actions to complete (5-10 minutes)
3. Check the live site
4. Verify all features work correctly

### Updates
Every time you push new code:
1. GitHub Actions runs automatically
2. Tests execute on Ubuntu/macOS/Windows
3. Application builds successfully
4. New version deploys to GitHub Pages

## 🔍 Troubleshooting

### Common Issues

#### 1. Repository Not Found
```bash
# Verify remote URL
git remote -v

# Update if incorrect
git remote set-url origin https://github.com/YOUR_USERNAME/branding-compliance-assistant.git
```

#### 2. GitHub Pages Not Working
- Check repository is public
- Verify Pages source is set to "GitHub Actions"
- Ensure GitHub Actions are enabled
- Check Actions tab for build status

#### 3. Build Failures
```bash
# Check Actions tab for errors
# Common fixes:
npm ci --prefer-offline
npm run build
npm run lint
npm test
```

#### 4. Wrong Base Path
Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/branding-compliance-assistant/',
  // ... other config
})
```

### Debug Steps
1. **Check Actions**: Go to repository → Actions tab
2. **Review Logs**: Click on failed workflow for details
3. **Local Testing**: Run `npm run build` locally
4. **Manual Build**: Test build process step by step

## 🔒 Custom Domain

### Setup Custom Domain
1. Add CNAME file to `public/` folder:
```
your-domain.com
```

2. Repository Settings → Pages:
   - Custom domain: `your-domain.com`
   - Enforce HTTPS: ✅

### DNS Configuration
Point your domain's DNS to GitHub Pages:
```
Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io

Type: A
Name: @
Value: 185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

## 📊 Performance Optimization

### Build Optimization
The Vite build automatically:
- Minifies JavaScript and CSS
- Optimizes images
- Generates source maps
- Splits code for faster loading

### Bundle Analysis
```bash
# Analyze bundle size
npm install --save-dev vite-bundle-analyzer
```

### Monitoring
- GitHub Pages provides basic analytics
- Lighthouse for performance testing
- Web Vitals for Core Web Metrics

## 🔄 CI/CD Pipeline

### Automated Workflows
The pipeline includes:
1. **Test**: Run on Ubuntu, macOS, Windows
2. **Lint**: Code style checking
3. **Build**: Production build verification
4. **Deploy**: Automatic GitHub Pages deployment

### Environment Variables
No secret environment variables needed for basic deployment.

### Branch Strategy
- `main`: Production branch (auto-deploys)
- `develop`: Development branch (optional)
- Feature branches: For new features

## 📝 Deployment Checklist

Before deployment:
- [ ] All tests pass locally
- [ ] Build succeeds without errors
- [ ] Repository URLs updated in package.json
- [ ] README.md reflects live demo URL
- [ ] All documentation is complete
- [ ] LICENSE file included

After deployment:
- [ ] Live site loads correctly
- [ ] All features work in production
- [ ] Mobile responsiveness verified
- [ ] Performance acceptable
- [ ] GitHub Actions workflow successful

## 🆘 Support

### Need Help?
1. **GitHub Issues**: Create an issue in repository
2. **GitHub Actions**: Check workflow logs
3. **Community**: GitHub Discussions
4. **Documentation**: README.md and other docs

### Resources
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Build Guide](https://vitejs.dev/guide/build.html)

---

**Your branding compliance app is now live and helping designers worldwide!** 🎉
