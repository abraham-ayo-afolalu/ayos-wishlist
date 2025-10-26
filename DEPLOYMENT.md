# 🚀 Deployment Guide for Ayo's Wishlist

## 📋 Pre-Deployment Checklist

Before deploying, make sure to:

1. **Update Personal Information**:
   - Change "Ayo" to your name in `index.html` and `admin.html`
   - **IMPORTANT**: Generate a new password hash using `generate-password-hash.html`
   - Update the admin password hash in `admin.js` (line 9)
   - Update repository URLs in `package.json` and `README.md`
   - **DELETE** `generate-password-hash.html` after use for security

2. **Test Locally**:
   - Run `python3 -m http.server 8000`
   - Test both public site and admin panel
   - Verify all functionality works

## 🌐 Deploy to Vercel (Recommended)

Vercel provides the best hosting for this static site with custom routing.

### Method 1: GitHub Integration (Easiest)
1. **Create GitHub Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Ayo's 90s Wishlist"
   git branch -M main
   git remote add origin https://github.com/YOURUSERNAME/ayos-90s-wishlist.git
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect settings and deploy!

### Method 2: Direct Upload
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts

### Method 3: One-Click Deploy
Use the button in the README:
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ayos-90s-wishlist)

## 📚 Deploy to GitHub Pages

Great for simple hosting, but no custom routing for admin panel.

1. **Push to GitHub** (see Method 1 above)
2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch
   - Save

3. **Access Your Site**:
   - Public: `https://YOURUSERNAME.github.io/ayos-90s-wishlist/`
   - Admin: `https://YOURUSERNAME.github.io/ayos-90s-wishlist/admin.html`

## 🔧 Deploy to Netlify

1. **Connect Repository**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose your repository

2. **Build Settings**:
   - Build command: (leave empty)
   - Publish directory: (leave empty or set to ".")

3. **Custom Redirects** (optional):
   Create `_redirects` file:
   ```
   /admin /admin.html 200
   ```

## 🏠 Self-Hosting

### Simple Python Server
```bash
python3 -m http.server 8000
```

### With Node.js
```bash
npx serve .
```

### With Apache/Nginx
Upload files to your web server directory. No special configuration needed!

## 🔒 Security Considerations

### Admin Panel Security
- **Generate secure password hash** using the included hash generator tool
- **Delete the hash generator** after use for security
- Passwords are now SHA-256 hashed instead of stored in plain text
- Consider adding IP restrictions if self-hosting
- The current setup uses client-side authentication (suitable for personal use)

### For Production Use
If you need stronger security:
- Implement server-side authentication
- Use HTTPS (Vercel/Netlify provide this automatically)
- Consider adding rate limiting

## 📱 Custom Domain

### Vercel
1. Go to your project dashboard
2. Click "Domains"
3. Add your custom domain
4. Follow DNS setup instructions

### GitHub Pages
1. In repository settings, scroll to "Pages"
2. Add custom domain in the "Custom domain" field
3. Create CNAME record pointing to `YOURUSERNAME.github.io`

## 🐛 Troubleshooting

### Common Issues
- **Admin panel not loading**: Check `/admin` routing in `vercel.json`
- **Images not showing**: Ensure image files are committed to git
- **Styles not loading**: Check file paths are relative, not absolute

### Testing Checklist
- [ ] Public wishlist loads correctly
- [ ] Admin panel requires authentication
- [ ] Can add/edit/remove items
- [ ] Cross-off functionality works
- [ ] Filtering and sorting work
- [ ] Mobile responsiveness
- [ ] All animations working

## 📞 Support

If you run into issues:
1. Check the browser console for errors
2. Verify all files are uploaded correctly
3. Test locally first with `python3 -m http.server 8000`

---

**Happy deploying! Your 90s wishlist is ready to go live! 🌟**
