/* ═══════════════════════════════════════════
   Session Routes
   ═══════════════════════════════════════════ */

const express = require('express');
const router = express.Router();

const {
  createSession,
  getSessions,
  getMySessions,
  getSessionById,
  requestToJoin,
  respondToRequest,
  completeSession
} = require('../controllers/session.controller');

const { protect } = require('../middleware/auth');
const { validate, validateQuery } = require('../middleware/validate');
const { createSessionSchema, respondRequestSchema, sessionQuerySchema } = require('../validators/session.validator');

// Protected routes (order matters — /mine before /:id)
router.post('/',           protect, validate(createSessionSchema), createSession);
router.get('/mine',        protect, getMySessions);
router.post('/:id/request',  protect, requestToJoin);
router.post('/:id/respond',  protect, validate(respondRequestSchema), respondToRequest);
router.patch('/:id/complete', protect, completeSession);

// Public routes
router.get('/',    validateQuery(sessionQuerySchema), getSessions);
router.get('/:id', getSessionById);

module.exports = router;
