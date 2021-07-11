require('./test_helper');

describe('POST /queries', () => {
  describe('when missing sql query', () => {
    it('it returns 400', () => {
      return request(app)
        .post('/queries')
        .expect(400)
        .then(res => {
          expect(res.body).toEqual({
            error: 'missing sql query'
          });
        });
    });
  });
  describe('when invalid sql query', () => {
    it('it returns 400', () => {
      return request(app)
        .post('/queries')
        .send({ query: 'SELECT azerty' })
        .expect(400)
        .then(res => {
          expect(res.body).toEqual({
            error: 'column "azerty" does not exist'
          });
        });
    });
  });
  describe('when valid sql query', () => {
    it('returns query result', () => {
      return request(app)
        .post('/queries')
        .send({ query: 'SELECT 1+1 AS count' })
        .expect(200)
        .then(res => {
          expect(res.body).toEqual([{ count: 2 }]);
        });
    });
  });
});
