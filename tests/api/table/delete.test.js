require('../../test_helper');

describe('DELETE /tables/:name', () => {
  describe('when table not found', () => {
    it('returns 404', (done) => {
      request(app)
        .delete('/tables/unkonwn')
        .set({ force: true })
        .expect(404, done);
    });
  });
  describe('when does not have force=true header', () => {
    it('returns 400', () => {
      return request(app)
        .delete('/tables/settings')
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
        .set({ force: true })
        .expect(204)
        .then(async (res) => {
          const data = await db.any('SELECT * FROM settings');
          expect(data.length).toEqual(0);
        });
    });
  });
  describe('when filters', () => {
    test.todo('deletes all matching records from table');
  });
});
