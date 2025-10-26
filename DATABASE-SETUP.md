# 🗃️ Database Setup Guide

Your wishlist now uses **Supabase** as a real database, so your items will be saved permanently and visible to everyone who visits your site!

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub (recommended)
3. Click **"New Project"**
4. Choose settings:
   - **Name**: `ayos-wishlist`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"**
6. Wait 2-3 minutes for setup

### Step 2: Create the Wishlist Table
1. In Supabase dashboard, go to **"Table Editor"**
2. Click **"Create a new table"**
3. Table name: `wishlist_items`
4. **Add these columns**:

| Column Name | Type | Settings |
|-------------|------|----------|
| `id` | `bigint` | Primary key, auto-increment ✅ (default) |
| `name` | `text` | Required |
| `price` | `numeric` | Optional |
| `category` | `text` | Optional |
| `reason` | `text` | Optional |
| `url` | `text` | Optional |
| `image_url` | `text` | Optional |
| `crossed_off` | `boolean` | Default: `false` |
| `created_at` | `timestamptz` | ✅ (default) |

5. Click **"Save"**

### Step 3: Configure Your Project
1. In Supabase dashboard, go to **Settings** → **API**
2. Copy your credentials:
   - **Project URL** (like `https://abcdef123456.supabase.co`)
   - **anon public key** (long key starting with `eyJ...`)

3. Open `supabase-config.js` in your project
4. Replace the placeholder values:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://your-project-id.supabase.co', // ← Your Project URL
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // ← Your anon key
};
```

### Step 4: Test It!
1. Open your admin panel (`/admin.html`)
2. Login with your password
3. Add a test item
4. Check your Supabase table - you should see the item!
5. Visit the public site - the item should appear there too!

## 🔒 Security Notes

- ✅ **Your admin password** is still secure (hashed locally)
- ✅ **Database is read-only** for public visitors
- ✅ **Write access** only through admin panel
- ✅ **Credentials are safe** - they're in `.gitignore`

## 🎯 Benefits of Database

- **✨ Persistent**: Items saved permanently
- **🌐 Public**: Visible to anyone who visits your site
- **🚀 Fast**: Loads instantly from the cloud
- **📱 Mobile**: Works on all devices
- **🔄 Real-time**: Updates immediately
- **💾 Backup**: Your data is safe in the cloud

## 🐛 Troubleshooting

**Items not saving?**
- Check browser console for error messages
- Verify Supabase credentials in `supabase-config.js`
- Make sure table name is exactly `wishlist_items`

**Can't see items on public site?**
- Check if items exist in Supabase Table Editor
- Verify both sites are loading the same database

**Database errors?**
- Ensure Supabase project is running (not paused)
- Check your API credentials are correct
- Verify table structure matches the guide above

## 📞 Need Help?

If you run into issues:
1. Check the browser console for specific error messages
2. Verify your Supabase project is active
3. Double-check the table structure in Supabase
4. Make sure `supabase-config.js` has the correct credentials

Your wishlist is now powered by a real database! 🎉
