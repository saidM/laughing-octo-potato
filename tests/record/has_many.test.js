require('../test_helper');

describe('GET /tables/:name/:pk/collection', () => {
  describe('when table not found', () => {
    it('returns 404', (done) => {
      request(app)
        .get('/tables/unknown/2/orders')
        .set('Authorization', 'Bearer azerty')
        .expect(404, done);
    });
  });
  describe('when record not found', () => {
    it('returns 404', (done) => {
      request(app)
        .get('/tables/clients/0/orders')
        .set('Authorization', 'Bearer azerty')
        .expect(404, done);
    });
  });
  describe('when collection is not part of record.has_many', () => {
    it('returns 404', (done) => {
      request(app)
        .get('/tables/clients/0/settings')
        .set('Authorization', 'Bearer azerty')
        .expect(404, done);
    });
  });
  describe('when valid collection provided', () => {
    it('returns collection', () => {
      return request(app)
        .get('/tables/clients/2/orders')
        .set('Authorization', 'Bearer azerty')
        .expect(200)
        .then(res => {
          expect(res.body).toEqual([{"amount": 10.25, "client_id": 2, "date": "2021-01-03T09:00:00.000Z", "id": 2}, {"amount": 0.99, "client_id": 2, "date": "2021-01-04T09:00:00.000Z", "id": 3}]);
        });
    });
  });
});
