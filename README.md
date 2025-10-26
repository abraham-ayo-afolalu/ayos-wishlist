# 🌟 Ayo's 90s Retro Wishlist Showcase 🌟

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ayos-90s-wishlist)

Welcome to the most totally awesome wishlist showcase website ever created! This site brings back all the radical vibes of the 1990s web with modern functionality. Perfect for sharing your dream items with friends and family!

## 🚀 Live Demo

- **Public Wishlist**: [Your Vercel URL]
- **Admin Panel**: [Your Vercel URL]/admin

## 📦 Quick Deploy

### Deploy to Vercel (Recommended)
1. Fork this repository
2. Connect your GitHub account to Vercel
3. Import this repository
4. Deploy automatically!

### Deploy to GitHub Pages
1. Fork this repository
2. Go to Settings > Pages
3. Set source to "Deploy from a branch"
4. Select main branch
5. Your site will be live at `https://yourusername.github.io/ayos-90s-wishlist`

## ✨ Features

### Core Functionality
- **Admin-Only Editing**: Secure login system - only you can add/remove items
- **Public Showcase**: Visitors can view your wishlist without editing access
- **Product Links**: Add URLs to items with automatic link previews
- **Personal Explanations**: Share why you want each item
- **Rich Item Display**: Beautiful cards with images, prices, and descriptions
- **Persistent Storage**: Your wishlist is saved in browser localStorage
- **Live Statistics**: See item count and total value in real-time
- **Categories**: Organize items by toys, electronics, books, clothes, music, or other

### 90s Retro Style
- **Rainbow Gradient Background**: Animated multicolor background
- **Neon Colors**: Bright magenta, cyan, and yellow color scheme
- **Retro Fonts**: Comic Neue and Press Start 2P pixel fonts
- **3D Borders**: Ridge and outset border effects
- **Blinking Text**: Classic 90s text animations
- **Scrolling Marquee**: Animated text banner in footer
- **Beveled Buttons**: Classic 90s button styling
- **Sparkle Effects**: Click anywhere for sparkle animations

### Admin Features
- **Separate Admin Panel**: Clean separation between public and admin views
- **Photo Upload**: Upload custom images for each wishlist item
- **GBP Currency**: All prices displayed in British Pounds
- **Quick Keyboard Shortcuts**: 
  - `Ctrl+Enter`: Quickly add items (admin panel only)
  - `Ctrl+E`: Export wishlist as text file (admin panel only)
- **Direct Admin Access**: Visit `/admin.html` to manage your wishlist

### Hidden Features
- **Matrix Background**: Green binary code pattern flowing behind the main content area for that hacker aesthetic
- **Random Effects**: Occasional border color flashes for extra 90s flair
- **Sparkle Click Effects**: Click anywhere for magical sparkles
- **Link Preview**: Automatic detection of popular shopping sites
- **Responsive Design**: Works on both desktop and mobile
- **Clean Public View**: No prices or admin controls visible to visitors

## 🚀 How to Use

### For Visitors
1. **View the Showcase**: See all wishlist items with descriptions
2. **Click Product Links**: Visit items on their original websites
3. **Read Explanations**: Understand why each item is wanted

### For Admin (You!)
1. **Access Admin Panel**: Navigate to `/admin.html` 
2. **Authenticate**: Enter the secure passcode (default: `ayo2025secure!`)
3. **Add Items**: Upload photos, set prices in GBP, add URLs and explanations
4. **Edit Items**: Click "Edit ✏️" to modify existing items
5. **Remove Items**: Click "Remove ❌" to delete items with confirmation
6. **View Public Site**: Click "VIEW PUBLIC SITE" to see how visitors see it
7. **Logout**: Click "LOGOUT 🚪" to securely end your admin session
8. **Export Data**: Use Ctrl+E to download your wishlist

## 🔐 Security & Configuration

### Admin Access
- **Secure password hashing**: Uses SHA-256 hashing instead of plain text
- **Generate your hash**: Use `generate-password-hash.html` to create your secure hash
- **Delete generator**: Remove the hash generator file after use for security
- **Update hash**: Replace the hash in `admin.js` line 9
- Sessions are remembered in localStorage
- Admin panel is completely hidden from public view

### Customization
- Update personal name in `index.html` and `admin.html`
- Change passcode in `admin.js`
- Modify currency symbols in CSS if needed
- Add/remove categories as desired

## 🛠 Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/ayos-90s-wishlist.git
cd ayos-90s-wishlist

# Start local server
python3 -m http.server 8000
# or
npm start

# Open in browser
open http://localhost:8000
```

## 🛠 Technical Details

- **Pure HTML/CSS/JavaScript**: No frameworks required
- **localStorage**: Automatic data persistence
- **Responsive Grid Layout**: Works on all screen sizes
- **CSS Animations**: Multiple keyframe animations for effects
- **Modern JavaScript**: ES6+ class-based architecture

## 🎨 90s Design Elements

This website authentically recreates the 90s web experience with:
- Table-style layouts (implemented with CSS Grid)
- Bright, contrasting color combinations
- Multiple animated backgrounds
- Retro typography choices
- Classic UI element styling
- Nostalgic visual effects

## 📱 Browser Compatibility

Best viewed in:
- Modern Chrome, Firefox, Safari, Edge
- Mobile browsers with JavaScript enabled
- **Retro Bonus**: "Best viewed in Netscape Navigator" disclaimer included!

## 🎉 Easter Eggs

- Click anywhere for sparkle effects
- Random color flashes every few seconds
- Hidden keyboard shortcuts
- Retro scrollbar styling
- Console messages with tips

---

*© 2025 My Totally Rad Wishlist | Made with 💖 and lots of neon colors*
