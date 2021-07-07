require('../test_helper');

describe('GET /tables/:name?limit=', () => {
  describe('when table not found', () => {
    it('returns 404', (done) => {
      request(app)
        .get('/tables/unknown')
        .query({ limit: '1', order: 'id' })
        .expect(404, done);
    });
  });
  describe('when limit param is not integer', () => {
    it('returns 400', () => {
      return request(app)
        .get('/tables/orders')
        .query({ limit: 'azerty', order: 'id' })
        .expect(400)
        .then(res => {
          expect(res.body).toEqual({
            error: 'column "azerty" does not exist'
          });
        });
    });
  });
  describe('when table found && limit param is valid', () => {
    describe('when no offset param', () => {
      it('applies limit', () => {
        return request(app)
          .get('/tables/orders')
          .query({ limit: '1', order: 'id' })
          .expect(200)
          .then(res => {
            expect(res.body.records.length).toEqual(1);
            expect(res.body.records[0].id).toEqual(1);
          });
      });
    });
    describe('when offset param', () => {
      describe('when offset param is not integer', () => {
        it('returns 400', () => {
          return request(app)
            .get('/tables/orders')
            .query({ limit: '1', offset: 'abc', order: 'id' })
            .expect(400)
            .then(res => {
              expect(res.body).toEqual({
                error: 'column "abc" does not exist'
              });
            });
        });
      });
      describe('when offset param valid', () => { 
        it('applies limit & offset', () => {
          return request(app)
            .get('/tables/orders')
            .query({ limit: '1', offset: '1', order: 'id' })
            .expect(200)
            .then(res => {
              expect(res.body.records.length).toEqual(1);
              expect(res.body.records[0].id).toEqual(2);
            });
        });
      });
    });
  });
});
