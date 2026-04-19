/* ═══════════════════════════════════════════
   Environment Configuration
   ═══════════════════════════════════════════ */

const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

// Validate required environment variables at startup
for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.error(`❌ Missing required environment variable: ${varName}`);
    console.error('   → Copy .env.example to .env and fill in the values');
    process.exit(1);
  }
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  DEFAULT_CREDITS: parseInt(process.env.DEFAULT_CREDITS, 10) || 10,
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
};
