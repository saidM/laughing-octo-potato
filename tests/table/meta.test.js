require('../test_helper');

describe('GET /tables/:name/:meta', () => {
  describe('when table not found', () => {
    it('returns 404', (done) => {
      request(app)
        .get('/tables/unknown_table/meta')
        .expect(404, done);
    });
  });
  describe('when table found', () => {
    it('returns table keys', () => {
      return request(app)
        .get('/tables/orders/meta')
        .expect(200)
        .then(res => {
          expect(res.body.keys).toEqual({
            primary_key: 'id',
            foreign_keys: [{
              column: 'client_id',
              name: 'orders_client_id_fkey',
              referenced_column: 'id',
              referenced_table: 'clients',
            }]
          });
        });
    });
    it('returns table columns', () => {
      return request(app)
        .get('/tables/settings/meta')
        .expect(200)
        .then(res => {
          expect(res.body.columns).toEqual([
            'key',
            'value'
          ]);
        });
    });
  });
});
