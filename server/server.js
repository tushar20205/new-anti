/* ═══════════════════════════════════════════
   SkillSwap+ API — Entry Point
   ═══════════════════════════════════════════ */

require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION — Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Connect to MongoDB then start server
connectDB().then(() => {
  const server = app.listen(env.PORT, () => {
    console.log(`\n🚀 SkillSwap+ API running on port ${env.PORT}`);
    console.log(`📍 Environment: ${env.NODE_ENV}`);
    console.log(`🔗 http://localhost:${env.PORT}/api/health\n`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('💥 UNHANDLED REJECTION — Shutting down...');
    console.error(err.name, err.message);
    server.close(() => process.exit(1));
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('💤 Process terminated.');
    });
  });
});
