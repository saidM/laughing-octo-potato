require('../test_helper');

describe('GET /tables/:name/:meta', () => {
  describe('when table not found', () => {
    it('returns 404', (done) => {
      request(app)
        .get('/tables/unknown_table/meta')
        .set('Authorization', 'Bearer azerty')
        .expect(404, done);
    });
  });
  describe('when table found', () => {
    it('returns table keys', () => {
      return request(app)
        .get('/tables/orders/meta')
        .set('Authorization', 'Bearer azerty')
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
        .set('Authorization', 'Bearer azerty')
        .expect(200)
        .then(res => {
          expect(res.body.columns).toEqual([
            { name: 'key', type: 'text', nullable: false, sequence: false },
            { name: 'value', type: 'text', nullable: false, sequence: false }
          ]);
        });
    });
    it('returns table has many', () => {
      return request(app)
        .get('/tables/clients/meta')
        .set('Authorization', 'Bearer azerty')
        .expect(200)
        .then(res => {
          expect(res.body.has_many).toEqual([
            'orders'
          ]);
        });
    });
  });
});
