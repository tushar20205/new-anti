/* ═══════════════════════════════════════════
   Credit Routes
   ═══════════════════════════════════════════ */

const express = require('express');
const router = express.Router();

const { getCredits, getTransactions } = require('../controllers/credit.controller');
const { protect } = require('../middleware/auth');

// All credit routes require auth
router.get('/',             protect, getCredits);
router.get('/transactions', protect, getTransactions);

module.exports = router;
