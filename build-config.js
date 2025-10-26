#!/usr/bin/env node
/**
 * Build Configuration Generator
 * 
 * This script runs during Vercel build to generate admin-config.js
 * from environment variables
 */

const fs = require('fs');
const path = require('path');

// Get the password hash from environment variable
const passwordHash = process.env.ADMIN_PASSWORD_HASH;

// If no environment variable, check if local config exists
if (!passwordHash) {
    console.log('⚠️  No ADMIN_PASSWORD_HASH environment variable found');
    console.log('📝 Checking for local admin-config.js...');
    
    const localConfigPath = path.join(__dirname, 'admin-config.js');
    if (fs.existsSync(localConfigPath)) {
        console.log('✅ Local admin-config.js found, using that');
        process.exit(0);
    } else {
        console.error('❌ ERROR: No admin-config.js found and no ADMIN_PASSWORD_HASH environment variable');
        console.error('');
        console.error('For local development:');
        console.error('  1. Copy admin-config.example.js to admin-config.js');
        console.error('  2. Generate hash using generate-hash.html');
        console.error('  3. Update admin-config.js with your hash');
        console.error('');
        console.error('For Vercel deployment:');
        console.error('  1. Go to Vercel Dashboard > Settings > Environment Variables');
        console.error('  2. Add ADMIN_PASSWORD_HASH with your hash value');
        console.error('  3. Redeploy');
        process.exit(1);
    }
}

// Generate the config file content
const configContent = `// Admin Configuration - Generated at build time
// DO NOT EDIT - This file is auto-generated from environment variables

const ADMIN_CONFIG = {
    passwordHash: '${passwordHash}'
};
`;

// Write the file
const outputPath = path.join(__dirname, 'admin-config.js');
fs.writeFileSync(outputPath, configContent, 'utf8');

console.log('✅ Generated admin-config.js from environment variable');
console.log(`   Hash: ${passwordHash.substring(0, 20)}...`);
