const mysql = require('mysql');

const c = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sqlrest'
});

c.connect(err => {
  if (err) throw err;
});

module.exports= c;
