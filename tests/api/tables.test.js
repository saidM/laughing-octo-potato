require('../test_helper');

describe('GET /tables', () => {
  it('returns tables', () => {
    return request(app)
      .get('/tables')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual([
          'clients',
          'orders',
          'settings'
        ]);
      });
  });
});
