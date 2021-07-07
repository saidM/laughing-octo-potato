require('../test_helper');

describe('PUT /tables/:name/:pk', () => {
  describe('when table not found', () => {
    it('returns 404', (done) => {
      request(app)
        .put('/tables/unknown/currency')
        .send({ value: '' })
        .expect(404, done);
    });
  });
  describe('when record not found', () => {
    it('returns 404', (done) => {
      request(app)
        .put('/tables/settings/unknown')
        .send({ key: 'timezone' })
        .expect(404, done);
    });
  });
  describe('when table & record found', () => {
    describe('when payload is invalid', () => {
      it('returns 400', () => {
        return request(app)
          .put('/tables/settings/currency')
          .send({ value: null })
          .expect(400)
          .then(async (res) => {
            const record = await db.one("select * from settings where key = 'currency'");
            expect(record.value).toEqual('usd');
            expect(res.body).toEqual({
              error: 'null value in column "value" of relation "settings" violates not-null constraint'
            });
          });
      });
    });
    describe('when payload is valid', () => {
      it('updates record', () => {
        return request(app)
          .put('/tables/settings/currency')
          .send({ value: 'eur' })
          .expect(200)
          .then(async (res) => {
            const record = await db.one("select * from settings where key = 'currency'");
            expect(record.value).toEqual('eur');
            expect(res.body).toEqual({
              key: 'currency',
              value: 'eur'
            });
          });
      });
    });
  });
});
