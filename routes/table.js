const router = require('express').Router({ mergeParams: true });
const db      = require('../lib/db');
const { validateFilters, validateOrderFilter } = require('../lib/middlewares');

router.get('/', validateFilters, validateOrderFilter, async (req, res, next) => {
  try {
    const records = await db.tableRecords(req.params.name, req.query);
    const recordsCount = await db.tableRecordsCount(req.params.name);
    res.json({ count: recordsCount, records });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const record = await db.create(req.params.name, req.body);
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    if (req.headers['force'] !== 'true') {
      return res.status(400).json({ error: 'You need to add the force=true header to your request in order to delete multiple records' });
    }
    const exists = await db.tableExists(req.params.name);
    if (!exists) {
      return res.sendStatus(404);
    }
    const records = await db.destroy(req.params.name);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.get('/meta', async (req, res, next) => {
  try {
    const primaryKey = await db.tablePrimaryKey(req.params.name);
    const foreignKeys = await db.tableForeignKeys(req.params.name);
    const columns = await db.tableColumns(req.params.name);
    res.json({ columns, keys: {
      primary_key: primaryKey, 
      foreign_keys: foreignKeys
    }});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
