/* ═══════════════════════════════════════════
   Credit Controller
   ═══════════════════════════════════════════ */

const creditService = require('../services/credit.service');
const catchAsync = require('../utils/catchAsync');

/**
 * GET /api/credits
 * Get current user's credit balance.
 */
const getCredits = catchAsync(async (req, res, next) => {
  const balance = await creditService.getBalance(req.user._id);

  res.status(200).json({
    status: 'success',
    data: { credits: balance }
  });
});

/**
 * GET /api/credits/transactions
 * Get paginated transaction history.
 */
const getTransactions = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

  const result = await creditService.getTransactionHistory(req.user._id, page, limit);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

module.exports = { getCredits, getTransactions };
