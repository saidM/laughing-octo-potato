const validateFilters = (req, res, next) => {
  if (typeof req.query !== 'undefined') {
    for (const [key, filter] of Object.entries(req.query)) {
      const reservedKeywords = ['order', 'offset', 'limit'];
      if (reservedKeywords.includes(key)) {
        continue;
      }
      const [condition, value] = filter.split('.');
      if (typeof condition === 'undefined' || typeof value === 'undefined') {
        return res.status(400).json({ error: 'Filters syntax error' });
      }
      const conditions = ['eq', 'gt', 'gte', 'lt', 'lte', 'not', 'is', 'not'];
      if (!conditions.includes(condition)) {
        return res.status(400).json({ error: 'Invalid filter condition' });
      }
    }
  }
  next();
};

const validateOrderFilter = (req, res, next) => {
  if (req.query.order) {
    const [column, direction] = req.query.order.split('.'); 
    if (typeof direction !== 'undefined') {
      if (!['asc', 'desc'].includes(direction)) {
        return res.status(400).json({ error: 'Invalid order condition' });
      }
    }
  }
  next();
};

module.exports = {
  validateFilters,
  validateOrderFilter,
};
