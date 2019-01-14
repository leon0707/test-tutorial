const { User } = require('../index');

const user_1 = {
  name: 'User 1',
  age: 100
};

const user_2 = {
  name: 'User 2',
  age: 99
};

const exclude = ['_id', '__v'];

describe('Test user api', () => {
  let user_1_id;
  let user_2_id;
  it('0 user in the mongodb', async () => {
    const cnt = await User.estimatedDocumentCount();
    expect(cnt).to.equal(0);
  });

  it('create users', (done) => {
    app.post('/users')
      .set('Accept', 'application/json')
      .send(user_1)
      .expect(201)
      .end(function (err, res) {
        if (err) throw err;
        expect(res.body).excluding(exclude).to.deep.equal(user_1);
        user_1_id = res.body._id;
      });
    app.post('/users')
      .set('Accept', 'application/json')
      .send(user_2)
      .expect(201)
      .end(function (err, res) {
        if (err) throw err;
        user_2_id = res.body._id;
        done();
      });
  });

  it('retrieve users', (done) => {
    app.get('/users')
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        expect(res.body[0]).excluding(exclude).to.deep.equal(user_1);
        expect(res.body[1]).excluding(exclude).to.deep.equal(user_2);
        done();
      });
  });

  it('update users', (done) => {
    app.put('/users/' + user_1_id)
      .set('Accept', 'application/json')
      .send({ name: 'User 1 updated' })
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        expect(res.body.name).to.equal('User 1 updated');
      });

    app.put('/users/' + user_2_id)
      .set('Accept', 'application/json')
      .send({ age: 200 })
      .expect(200)
      .end(function (err, res) {
        if (err) throw err;
        expect(res.body.age).to.equal(200);
        done();
      });
  });

  it('delete users', (done) => {
    app.delete('/users/' + user_1_id)
      .expect(204)
      .end(function (err, res) {
        if (err) throw err;
      });
    app.delete('/users/' + user_2_id)
      .expect(204)
      .end(function (err, res) {
        if (err) throw err;
        done();
      });
  });
});
