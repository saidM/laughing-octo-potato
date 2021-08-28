require('../test_helper');

describe('GET /tables/:name?order=', () => {
  describe('when table not found', () => {
    it('returns 404', (done) => {
      request(app)
        .get('/tables/unkown')
        .set('Authorization', 'Bearer azerty')
        .query({ order: 'key' })
        .expect(404, done);
    });
  });
  describe('when order param is not a column from the table', () => {
    it('returns 404', (done) => {
      request(app)
        .get('/tables/settings')
        .set('Authorization', 'Bearer azerty')
        .query({ order: 'id' })
        .expect(400, done);
    });
  });
  describe('when table found && order param is valid', () => {
    describe('when invalid direction', () => {
      it('returns 400', (done) => {
        request(app)
          .get('/tables/settings')
          .set('Authorization', 'Bearer azerty')
          .query({ order: 'id.unknown' })
          .expect(400, done);
      });
    });
    describe('when no direction', () => {
      it('returns table ordered asc', () => {
        return request(app)
          .get('/tables/settings')
          .set('Authorization', 'Bearer azerty')
          .query({ order: 'key' })
          .expect(200)
          .then(res => {
            const ids = res.body.records.map(record => record.id);
            expect(ids.sort()).toEqual(ids);
          });
      });
    });
    describe('when asc direction', () => {
      it('returns table ordered asc', () => {
        return request(app)
          .get('/tables/settings')
          .set('Authorization', 'Bearer azerty')
          .query({ order: 'key.asc' })
          .expect(200)
          .then(res => {
            const ids = res.body.records.map(record => record.id);
            expect(ids.sort()).toEqual(ids);
          });
      });
    });
    describe('when desc direction', () => {
      it('returns table ordered desc', () => {
        return request(app)
          .get('/tables/settings')
          .set('Authorization', 'Bearer azerty')
          .query({ order: 'key.desc' })
          .expect(200)
          .then(res => {
            const ids = res.body.records.map(record => record.id);
            expect(ids.sort().reverse()).toEqual(ids);
          });
      });
    });
  });
});
