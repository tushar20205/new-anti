/* ═══════════════════════════════════════════
   Async Error Wrapper
   Eliminates try/catch in every controller
   ═══════════════════════════════════════════ */

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
