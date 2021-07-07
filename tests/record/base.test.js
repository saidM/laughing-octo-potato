require('../test_helper');

describe('GET /tables/:name/:pk', () => {
  describe('when table not found', () => {
    it('returns 404', (done) => {
      request(app)
        .get('/tables/unkonwn/1')
        .expect(404, done);
    });
  });
  describe('when record not found', () => {
    it('returns 404', (done) => {
      request(app)
        .get('/tables/clients/0')
        .expect(404, done);
    });
  });
  describe('when table & record found', () => {
    describe('when pk is id', () => {
      it('returns record', () => {
        return request(app)
          .get('/tables/orders/1')
          .expect(200)
          .then(res => {
            expect(res.body).toEqual({
              "amount": 99.5,
              "client_id": 1,
              "date": "2021-01-02T09:00:00.000Z",
              "id": 1
            });
          });
      });
    });
    describe('when pk is not id', () => {
      it('returns record', () => {
        return request(app)
          .get('/tables/settings/currency')
          .expect(200)
          .then(res => {
            expect(res.body).toEqual({
              key: 'currency',
              value: 'usd'
            });
          });
      });
    });
  });
});
