const router = require('express').Router({ mergeParams: true });
const db      = require('../lib/db');

router.get('/', async (req, res, next) => {
  try {
    const record = await db.record(req.params.name, req.params.pk);
    if (record === null) {
      return res.sendStatus(404);
    }
    res.json(record);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const record = await db.record(req.params.name, req.params.pk);
    if (record === null) {
      return res.sendStatus(404);
    }
    const update = await db.update(req.params.name, req.params.pk, req.body);
    res.json(update);
  } catch (err) {
    next(err);
  }
});

router.delete('/', async (req, res, next) => {
  try {
    const [record] = await db.destroy(req.params.name, {
      pk: req.params.pk
    });
    if (typeof record === 'undefined') {
      return res.sendStatus(404);
    }
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.get('/:collection', async (req, res, next) => {
  try {
    const record = await db.record(req.params.name, req.params.pk);
    if (record === null) {
      return res.sendStatus(404);
    }
    const foreignKeys = await db.tableForeignKeys(req.params.collection);
    let foreignKey = foreignKeys.find(key => key.referenced_table == req.params.name);
    if (typeof foreignKey === 'undefined') {
      return res.sendStatus(404);
    }
    foreignKey = foreignKey.column;
    const records = await db.tableRecords(req.params.collection, {
      [foreignKey]: `eq.${req.params.pk}`,
    });
    res.json(records);
  } catch (err) {
    next(err);
  }
});

router.post('/:collection', async (req, res, next) => {
  try {
    const record = await db.record(req.params.name, req.params.pk);
    if (record === null) {
      return res.sendStatus(404);
    }
    const foreignKeys = await db.tableForeignKeys(req.params.collection);
    let foreignKey = foreignKeys.find(key => key.referenced_table == req.params.name);
    if (typeof foreignKey === 'undefined') {
      return res.sendStatus(404);
    }
    foreignKey = foreignKey.column;
    const body = { ...req.body, [foreignKey]: req.params.pk };
    const insert = await db.create(req.params.collection, body);
    res.status(201).json(insert);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
