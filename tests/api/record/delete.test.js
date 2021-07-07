require('../../test_helper');

describe('DELETE /tables/:name/:pk', () => {
  describe('when table not found', () => {
    it('returns 404', (done) => {
      request(app)
        .delete('/tables/unknown/1')
        .expect(404, done);
    });
  });
  describe('when record not found', () => {
    it('returns 404', (done) => {
      request(app)
        .delete('/tables/clients/0')
        .expect(404, done);
    });
  });
  describe('when table & record found', () => {
    describe('when pk is id', () => {
      it('deletes record', () => {
        return request(app)
          .delete('/tables/orders/1')
          .expect(204)
          .then(async (res) => {
            const data = await db.any('SELECT * FROM orders WHERE id = 1');
            expect(data.length).toEqual(0);
          });
      });
    });
    describe('when pk is not id', () => {
      it('returns record', () => {
        return request(app)
          .delete('/tables/settings/currency')
          .expect(204)
          .then(async (res) => {
            const data = await db.any("SELECT * FROM settings WHERE key = 'currency'");
            expect(data.length).toEqual(0);
          });
      });
    });
  });
});
