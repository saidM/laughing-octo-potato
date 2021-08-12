require('../test_helper');

describe('GET /tables/:name?filter=', () => {
  describe('when table not found', () => {
    it('returns 404', (done) => {
      request(app)
        .get('/tables/unkonwn_table')
        .query({ key: 'eq.currency' })
        .expect(404, done)
    });
  });
  describe('when filter param is not formatted correctly', () => {
    it('returns 400', () => {
      return request(app)
        .get('/tables/settings')
        .query({ key: 'invalid.currency' })
        .expect(400)
        .catch(err => {
          expect(err).toEqual('said');
        });
    });
  });
  describe('when table found && filter param is valid', () => {
    describe('when filter is eq', () => {
      it('applies filter', () => {
        return request(app)
          .get('/tables/settings')
          .query({ key: 'eq.currency' })
          .expect(200)
          .then(res => {
            expect(res.body.records.length).toEqual(1);
            expect(res.body.records[0].key).toEqual('currency');
          });
      });
      it('applies filter (regardless of case)', () => {
        return request(app)
          .get('/tables/settings')
          .query({ key: 'eq.Currency' })
          .expect(200)
          .then(res => {
            expect(res.body.records.length).toEqual(1);
            expect(res.body.records[0].key).toEqual('currency');
          });
      });
    });
    describe('when filter is gt', () => {
      it('applies filter', () => {
        return request(app)
          .get('/tables/orders')
          .query({ id: 'gt.2', order: 'id' })
          .expect(200)
          .then(res => {
            const ids = res.body.records.map(record => record.id);
            expect(ids.length).toEqual(1);
            expect(ids).toEqual([3]);
          });
      });
    });
    describe('when filter is gte', () => {
      it('applies filter', () => {
        return request(app)
          .get('/tables/orders')
          .query({ id: 'gte.2', order: 'id' })
          .expect(200)
          .then(res => {
            const ids = res.body.records.map(record => record.id);
            expect(ids.length).toEqual(2);
            expect(ids).toEqual([2, 3]);
          });
      });
    });
    describe('when filter is lt', () => {
      it('applies filter', () => {
        return request(app)
          .get('/tables/orders')
          .query({ id: 'lt.3', order: 'id' })
          .expect(200)
          .then(res => {
            const ids = res.body.records.map(record => record.id);
            expect(ids.length).toEqual(2);
            expect(ids).toEqual([1, 2]);
          });
      });
    });
    describe('when filter is lte', () => {
      it('applies filter', () => {
        return request(app)
          .get('/tables/orders')
          .query({ id: 'lte.3', order: 'id' })
          .expect(200)
          .then(res => {
            const ids = res.body.records.map(record => record.id);
            expect(ids.length).toEqual(3);
            expect(ids).toEqual([1, 2, 3]);
          });
      });
    });
    describe('when filter is is.empty', () => {
      xit('applies filter', () => {
        return request(app)
          .get('/tables/employees')
          .query({ description: 'is.empty' })
          .expect(200)
          .then(res => {
            expect(res.body.records.length).toEqual(1);
            expect(res.body.records[0].id).toEqual('1');
            expect(res.body.records[0].description).toEqual('');
          });
      });
    })
    describe('when filter is not', () => {
      it('applies filter', () => {
        return request(app)
          .get('/tables/settings')
          .query({ key: 'not.currency' })
          .expect(200)
          .then(res => {
            expect(res.body.records.length).toEqual(1);
            const keys = res.body.records.map(x => x.key);
            expect(keys).toEqual(['locale']);
          });
      });
    });
    describe('when filter is is.true', () => {
      it('applies filter', () => {
        return request(app)
          .get('/tables/clients')
          .query({ active: 'is.true' })
          .expect(200)
          .then(res => {
            expect(res.body.records.length).toEqual(2);
            const ids = res.body.records.map(x => x.id);
            expect(ids).toEqual([1, 2]);
          });
      });
    });
    describe('when filter is is.false', () => {
      it('applies filter', () => {
        return request(app)
          .get('/tables/clients')
          .query({ active: 'is.false' })
          .expect(200)
          .then(res => {
            expect(res.body.records.length).toEqual(1);
            const ids = res.body.records.map(x => x.id);
            expect(ids).toEqual([3]);
          });
      });
    });
    describe('when multiple filters', () => {
      it('applies filters', () => {
        return request(app)
          .get('/tables/clients')
          .query({ id: 'eq.1', active: 'is.true' })
          .expect(200)
          .then(res => {
            expect(res.body.records.length).toEqual(1);
            expect(res.body.records[0].id).toEqual(1);
            expect(res.body.records[0].active).toEqual(true);
          });
      });
    });
  });
});
