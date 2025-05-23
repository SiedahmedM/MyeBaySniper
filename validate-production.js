#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating MyeBaySniper Production Setup...\n');

// Check .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  console.log('📋 Checking .env.local:');
  
  const checks = {
    'NEXT_PUBLIC_EBAY_APP_ID': false,
    'EBAY_DEV_ID': false,
    'EBAY_CERT_ID': false,
    'EBAY_CLIENT_ID': false,
    'EBAY_CLIENT_SECRET': false,
    'NEXT_PUBLIC_EBAY_ENVIRONMENT': false
  };
  
  lines.forEach(line => {
    for (const key in checks) {
      if (line.startsWith(key + '=')) {
        const value = line.split('=')[1];
        if (value.includes('SBX') || value.includes('sandbox')) {
          console.log(`❌ ${key} still contains sandbox value!`);
        } else if (value && value.trim() !== '') {
          console.log(`✅ ${key} is set (production)`);
          checks[key] = true;
        }
      }
    }
  });
  
  // Check environment
  if (envContent.includes('NEXT_PUBLIC_EBAY_ENVIRONMENT=production')) {
    console.log('✅ Environment is set to production');
  } else {
    console.log('❌ Environment is not set to production!');
  }
} else {
  console.log('❌ .env.local file not found!');
}

console.log('\n📋 Checking source files:');

// Check config.ts
const configPath = path.join(__dirname, 'src/lib/ebay/config.ts');
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  if (configContent.includes('YOUR_PRODUCTION_RUNAME')) {
    console.log('❌ Production RuName not set in src/lib/ebay/config.ts');
  } else {
    console.log('✅ RuName appears to be configured');
  }
}

// Check settings
const settingsPath = path.join(__dirname, 'src/app/settings/SettingsContent.tsx');
if (fs.existsSync(settingsPath)) {
  const settingsContent = fs.readFileSync(settingsPath, 'utf8');
  if (settingsContent.includes('YOUR_PRODUCTION_RUNAME')) {
    console.log('❌ Production RuName not set in settings page');
  } else {
    console.log('✅ Settings page RuName appears to be configured');
  }
}

console.log('\n🚀 Next Steps:');
console.log('1. Get your production credentials from https://developer.ebay.com');
console.log('2. Update .env.local with production values');
console.log('3. Get your production RuName');
console.log('4. Update the RuName in both config files');
console.log('5. Deploy to Vercel with updated environment variables');
console.log('\n⚠️  Remember: Production mode uses REAL money! Test with cheap items first!');