require('../../test_helper');

describe('POST /tables/:name', () => {
  describe('when table not found', () => {
    it('returns 404', (done) => {
      request(app)
        .post('/tables/unknown')
        .send({ key: 'timezone' })
        .expect(404, done);
    });
  });
  describe('when table found', () => {
    describe('when payload is invalid', () => {
      it('returns 400', () => {
        return request(app)
          .post('/tables/settings')
          .send({ key: 'timezone' })
          .expect(400)
          .then(async (res) => {
            const [record] = await db.any("select * from settings where key = 'timezone'");
            expect(record).toBeUndefined();
            expect(res.body).toEqual({
              error: 'null value in column "value" of relation "settings" violates not-null constraint'
            });
          });
      });
    });
    describe('when payload is valid', () => {
      it('creates record', () => {
        return request(app)
          .post('/tables/settings')
          .send({ key: 'timezone', value: 'Europe/Paris' })
          .expect(201)
          .then(async (res) => {
            const record = await db.any("select * from settings where key = 'timezone'");
            expect(record[0].value).toEqual('Europe/Paris');
            expect(res.body).toEqual({
              key: 'timezone',
              value: 'Europe/Paris'
            });
          });
      });
    });
  });
});

describe('POST /tables/:name/:pk/:collection', () => {
  describe('when table not found', () => {
    it('returns 404', (done) => {
      request(app)
        .post('/tables/unknown/1/orders')
        .send({ date: '2021-07-07T08:00:00Z', amount: '4.95' })
        .expect(404, done);
    });
  });
  describe('when record not found', () => {
    it('returns 404', (done) => {
      request(app)
        .post('/tables/clients/0/orders')
        .send({ date: '2021-07-07T08:00:00Z', amount: '4.95' })
        .expect(404, done);
    });
  });
  describe('when collection not found', () => {
    it('returns 404', (done) => {
      request(app)
        .post('/tables/clients/1/transactions')
        .send({ date: '2021-07-07T08:00:00Z', amount: '4.95' })
        .expect(404, done);
    });
  });
  describe('when table, record & collection found', () => {
    describe('when payload is invalid', () => {
      it('returns 400', () => {
        return request(app)
          .post('/tables/clients/1/orders')
          .send({ date: '2021-07-07T08:00:00Z' })
          .expect(400)
          .then(async (res) => {
            expect(res.body).toEqual({
              error: 'null value in column "amount" of relation "orders" violates not-null constraint'
            });
          });
      });
    });
    describe('when payload is valid', () => {
      it('creates record', () => {
        return request(app)
          .post('/tables/clients/1/orders')
          .send({ date: '2021-07-07T08:00:00Z', amount: '4.95' })
          .expect(201)
          .then(async (res) => {
            expect(res.body.client_id).toEqual(1);
            expect(res.body.date).toEqual('2021-07-07T06:00:00.000Z');
            expect(res.body.amount).toEqual(4.95);
            const record = await db.any('select * from orders where id = $1', [res.body.id]);
            expect(record[0].amount).toEqual(4.95);
          });
      });
    });
  });
});
