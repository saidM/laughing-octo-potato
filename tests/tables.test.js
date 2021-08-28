require('./test_helper');

describe('GET /tables', () => {
  it('returns tables', () => {
    return request(app)
      .get('/tables')
      .set('Authorization', 'Bearer azerty')
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
