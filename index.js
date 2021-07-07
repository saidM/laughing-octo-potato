if (process.env.NODE_ENV !== 'test') {
  process.env.DATABASE_URL = 'postgres://saidmimouni:@localhost/sql2rest';
}

const db      = require('./lib/db');
const express = require('express');
const { validateFilters, validateOrderFilter } = require('./lib/middlewares');

const app = express();
app.use(express.json());

/*app.use(async (req, res, next) => {
  try {
    const connection = await db.connect();
    connection.done();
    next();
  } catch (err) {
    return res.sendStatus(401);
  }
});*/

app.get('/tables', async (req, res) => {
  const tables = await db.tables();
  res.json(tables);
});

app.get('/views', async (req, res) => {
  const views = await db.views();
  res.json(views);
});

app.use('/tables/:name', require('./routes/table'));
app.use('/tables/:name/:pk', require('./routes/record'));

app.use((err, req, res, next) => {
  if (err.message.match(/relation "\w+" does not exist/)) {
    return res.status(404).json({ error: `table ${req.params.name} does not exist` });
  }
  columnDoesNotExistRegex = /column "\w+" does not exist/;
  let status = 500;
  if (err.message.match(columnDoesNotExistRegex)) {
    status = 400;
  }
  if (err.message.match(/violates not-null constraint/)) {
    status = 400;
  }
  res.status(status).json({ error: err.message });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
}

module.exports = app;
