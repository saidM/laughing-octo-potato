if (process.env.NODE_ENV !== 'test') {
  process.env.DATABASE_URL = 'postgres://saidmimouni:@localhost/sql2rest';
}

const db      = require('./lib/db');
const express = require('express');
const cors = require('cors');
const { validateFilters, validateOrderFilter } = require('./lib/middlewares');

const app = express();
app.use(cors());
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

app.post('/queries', async (req, res, next) => {
  try {
    if (!req.body.query) {
      return res.status(400).json({ error: 'missing sql query' });
    }
    const data = await db.any(req.body.query);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

app.use('/tables/:name', require('./routes/table'));
app.use('/tables/:name/:pk', require('./routes/record'));

app.use((err, req, res, next) => {
  columnDoesNotExistRegex = /column "\w+" does not exist/;
  tableDoesNotExistRegex = /relation "\w+" does not exist/;
  let status = 500;
  if (err.message.match(tableDoesNotExistRegex)) {
    status = 404;
  }
  if (err.message.match(columnDoesNotExistRegex)) {
    status = 400;
  }
  if (err.message.match(/violates not-null constraint/)) {
    status = 400;
  }
  res.status(status).json({ error: err.message });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(3001, () => {
    console.log('Server listening on port 3001');
  });
}

module.exports = app;
