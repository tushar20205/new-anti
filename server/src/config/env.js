const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];

const insecureSecretValues = new Set([
  'skillswap-jwt-secret-change-me-in-production',
  'skillswap-refresh-secret-change-me-in-production',
  'change-me',
  'replace-me'
]);

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    console.error('Copy .env.example to .env and fill in real values.');
    process.exit(1);
  }
}

if (process.env.NODE_ENV === 'production') {
  ['JWT_SECRET', 'JWT_REFRESH_SECRET'].forEach((varName) => {
    if (insecureSecretValues.has(process.env[varName]) || process.env[varName].length < 32) {
      console.error(`${varName} must be a strong production secret of at least 32 characters.`);
      process.exit(1);
    }
  });
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  DB_CONNECT_RETRIES: parseInt(process.env.DB_CONNECT_RETRIES, 10) || 3,
  DB_CONNECT_RETRY_DELAY_MS: parseInt(process.env.DB_CONNECT_RETRY_DELAY_MS, 10) || 1500,
  REQUIRE_TRANSACTION_DB: process.env.REQUIRE_TRANSACTION_DB !== 'false',
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  DEFAULT_CREDITS: parseInt(process.env.DEFAULT_CREDITS, 10) || 10,
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || ''
};
