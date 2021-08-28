require('../test_helper');

describe('DELETE /tables/:name', () => {
  describe('when table not found', () => {
    it('returns 404', (done) => {
      request(app)
        .delete('/tables/unkonwn')
        .set('Authorization', 'Bearer azerty')
        .set({ force: true })
        .expect(404, done);
    });
  });
  describe('when does not have force=true header', () => {
    it('returns 400', () => {
      return request(app)
        .delete('/tables/settings')
        .set('Authorization', 'Bearer azerty')
        .expect(400)
        .then(res => {
          expect(res.body.error).toEqual('You need to add the force=true header to your request in order to delete multiple records')
        });
    });
  });
});
describe('when force=true header present', () => {
  describe('when no filters', () => {
    it('deletes all records from table', () => {
      return request(app)
        .delete('/tables/settings')
        .set('Authorization', 'Bearer azerty')
        .set({ force: true })
        .expect(204)
        .then(async (res) => {
          const data = await db.any('SELECT * FROM settings');
          expect(data.length).toEqual(0);
        });
    });
  });
  describe('when filters', () => {
    it('deletes all matching records from table', () => {
      return request(app)
        .delete('/tables/orders')
        .query({ id: 'gte.2' })
        .set('Authorization', 'Bearer azerty')
        .set({ force: true })
        .expect(204)
        .then(async (res) => {
          const data = await db.any('SELECT id FROM orders');
          expect(data.length).toEqual(1);
          expect(data[0].id).toEqual(1);
        });
    });
  });
});
