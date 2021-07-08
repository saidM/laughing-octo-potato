const pgp = require('pg-promise')({});
const db = pgp(process.env.DATABASE_URL);

const tables = async () => {
  const query = "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema' ORDER BY tablename";
  const data = await db.any(query);
  return data.map(table => table.tablename);
};

const views = async () => {
  const query = "SELECT viewname FROM pg_catalog.pg_views WHERE schemaname != 'pg_catalog' AND schemaname != 'information_schema' ORDER BY viewname";
  const data = await db.any(query);
  return data.map(table => table.viewname);
};

const tablePrimaryKey = async (name) => {
  const query = 'SELECT a.attname AS primary_key FROM   pg_index i JOIN   pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey) WHERE  i.indrelid = $1::regclass AND i.indisprimary';
  const data = await db.one(query, [name]);
  return data.primary_key;
};

const tableForeignKeys = async (name) => {
  const query = 'SELECT conrelid::regclass AS table_from, conname, pg_get_constraintdef(oid) as condef FROM pg_catalog.pg_constraint r';
  const data = await db.any(query, [name]);
  const regex = /FOREIGN KEY (.+) REFERENCES (\w+)(.+)/;
  return data.filter(key => key.table_from == name && regex.exec(key.condef))
    .map(key => {
      const groups = regex.exec(key.condef);
      const [, column, referencedTable, referencedColumn] = regex.exec(key.condef);
      return {
        name: key.conname,
        column: column.replace('(', '').replace(')', ''),
        referenced_table: referencedTable,
        referenced_column: referencedColumn.replace('(', '').replace(')', ''),
      };
    });
};

const tableColumns = async (name) => {
  const query = 'SELECT column_name FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = $1';
  const data = await db.any(query, [name]);
  return data.map(table => table.column_name);
};

const tableRecords = async (name, options) => {
  let conditionsCount = 0;
  const params = [];
  let query = `SELECT * FROM ${name}`;
  Object.keys(options).forEach(option => {
    if (option == 'order' || option == 'limit' || option == 'offset') {
      return;
    }
    const column = option;
    const [condition, value] = options[option].split('.');
    const keyword = conditionsCount < 1 ? 'WHERE' : 'AND';
    if (condition == 'eq') {
      params.push(value);
      conditionsCount += 1;
      query += ` ${keyword} ${column} = $${params.length}`; 
    } else if (condition == 'gt') {
      params.push(value);
      conditionsCount += 1;
      query += ` ${keyword} ${column} > $${params.length}`; 
    } else if (condition == 'gte') {
      params.push(value);
      conditionsCount += 1;
      query += ` ${keyword} ${column} >= $${params.length}`; 
    } else if (condition == 'lt') {
      params.push(value);
      conditionsCount += 1;
      query += ` ${keyword} ${column} < $${params.length}`; 
    } else if (condition == 'lte') {
      params.push(value);
      conditionsCount += 1;
      query += ` ${keyword} ${column} <= $${params.length}`; 
    } else if (condition == 'is' && value === 'empty') {
      conditionsCount += 1;
      query += ` ${keyword} ${column} = ''`;
    } else if (condition == 'is' && value === 'true') {
      conditionsCount += 1;
      query += ` ${keyword} ${column} IS TRUE`;
    } else if (condition == 'is' && value === 'false') {
      conditionsCount += 1;
      query += ` ${keyword} ${column} IS FALSE`;
    } else if (condition == 'not') {
      params.push(value);
      conditionsCount += 1;
      query += ` ${keyword} ${column} <> $${params.length}`; 
    }
  });
  if (typeof options.order !== 'undefined') {
    const [column, direction] = options.order.split('.');
    if (typeof column !== 'undefined' && typeof direction === 'undefined') {
      query += ` ORDER BY ${column} ASC`;
    }
    if (typeof column !== 'undefined' && typeof direction !== 'undefined') {
      query += ` ORDER BY ${column} ${direction}`;
    }
  }
  if (typeof options.limit !== 'undefined') {
    query += ` LIMIT ${options.limit}`;
  }
  if (typeof options.limit !== 'undefined' && typeof options.offset !== 'undefined') {
    query += ` OFFSET ${options.offset}`;
  }
  if (typeof options.limit === 'undefined') {
    query += ' LIMIT 50';
  }
  const data = await db.any(query, params);
  return data;
};

const tableRecordsCount = async (name) => {
  const query = `SELECT COUNT(*) AS count FROM ${name}`;
  const data = await db.one(query);
  return parseInt(data.count);
};

const record = async (tableName, pk, include = null) => {
  const primaryKey = await tablePrimaryKey(tableName);
  const query = `SELECT * FROM ${tableName} WHERE ${primaryKey} = $1`;
  const data = await db.any(query, [pk]);
  if (data.length == 0) {
    return null;
  }
  const record = data[0];
  if (include !== null) {
    const includes = include.split(',');
    if (includes.length > 0) {
      for (const include of includes) {
        const foreignKeys = await tableForeignKeys(include);
        const foreignKey = foreignKeys
          .find(key => key.referenced_table == tableName)
          .column
        const includeQuery = `SELECT * FROM ${include} WHERE ${foreignKey} = ${pk}`;
        const includeData = await db.any(includeQuery);
        record[include] = includeData;
      }
    }
  }
  return record;
};

const destroy = async (tableName, pk = null) => {
  if (pk == null) {
    const query = `DELETE FROM ${tableName}`;
    return db.none(query);
  } else {
    const primaryKey = await tablePrimaryKey(tableName);
    const query = `DELETE FROM ${tableName} WHERE ${primaryKey} = $1 RETURNING *`;
    return db.any(query, [pk]);
  }
};

const create = async (tableName, payload) => {
  const columns = Object.keys(payload).join(',');
  const indexes = Object.keys(payload).map((key, index) => `$${index+1}`);
  const query = `INSERT INTO ${tableName} (${columns}) VALUES (${indexes}) RETURNING *`;
  const data = await db.any(query, Object.values(payload));
  return data[0];
};

const update = async (tableName, pk, payload) => {
  const primaryKey = await tablePrimaryKey(tableName);
  const columns = Object.keys(payload).map((column, index) => {
    return `${column} = $${index+1}`;
  });
  const query = `UPDATE ${tableName} SET ${columns.join(',')} WHERE ${primaryKey} = $${Object.keys(payload).length+1} RETURNING *`;
  return db.one(query, [...Object.values(payload), pk]);
};

const tableExists = async (name) => {
  const query = `SELECT 1+1 FROM ${name} LIMIT 1`;
  return db.one(query);
};

const hasMany = async (name) => {
  const hasMany = [];
  const t = await tables();
  for (const table of t) {
    let foreignKeys = await tableForeignKeys(table);
    foreignKeys = foreignKeys.filter(x => x.referenced_table == name);
    foreignKeys.forEach(foreignKey => {
      hasMany.push(table);
    });
  }
  return hasMany.sort();
};

module.exports = {
  tables,
  views,
  tablePrimaryKey,
  tableForeignKeys,
  tableColumns,
  tableRecords,
  tableRecordsCount,
  tableExists,
  record,
  destroy,
  create,
  update,
  hasMany,
  any: db.any,
  one: db.one,
};
