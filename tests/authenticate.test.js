require('./test_helper');

describe('Authenticate Middleware', () => {
  describe('when no token', () => {
    it('returns 401', () => {
      return request(app)
      .get('/tables')
      .expect(401);
    });
  });
  describe('when invalid token', () => {
    it('returns 401', () => {
      return request(app)
      .get('/tables')
      .set('Authorization', 'Bearer invalid')
      .expect(401);
    });
  });
  describe('when token', () => {
    it('returns 200', () => {
      return request(app)
      .get('/tables')
      .set('Authorization', 'Bearer azerty')
      .expect(200);
    });
  });
});
