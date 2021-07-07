require('../test_helper');

describe('GET /views', () => {
  it('returns views', () => {
    return request(app)
      .get('/views')
      .expect(200)
      .then(res => {
        expect(res.body).toEqual([
          'active_clients'
        ]);
      });
  });
});
