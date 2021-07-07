require('../test_helper');

describe('GET /tables/:name', () => {
  describe('when table not found', () => {
    it('returns 404', (done) => {
      request(app)
        .get('/tables/unknown_take')
        .expect(404, done);
    });
  });
  describe('when table found', () => {
    it('returns table records total count', () => {
      return request(app)
        .get('/tables/settings')
        .expect(200)
        .then(res => {
          expect(res.body.count).toEqual(2);
        });
    });
    it('returns table records', () => {
      return request(app)
        .get('/tables/settings')
        .expect(200)
        .then(res => {
          expect(res.body.records.length).toEqual(2);
          expect(res.body.records).toEqual([
            { key: 'currency', value: 'usd' },
            { key: 'locale', value: 'en' }
          ]);
        });
    });
  });
});
