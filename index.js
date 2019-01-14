const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const PORT = 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/test';

// mongodb init
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { keepAlive: true, useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('db connected');
});

// define a model
const User = mongoose.model('User', new mongoose.Schema({ name: String, age: Number }));

// express init
const app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// routes
app.get('/users', (req, res) => {
  User.find({}).exec(function (err, users) {
    if (err) throw err;
    res.status(200).json(users);
  });
});

app.post('/users', (req, res) => {
  User({
    name: req.body.name,
    age: req.body.age
  }).save(function (err, user) {
    if (err) throw err;
    res.status(201).json(user);
  });
});

app.route('/users/:user_id')
  .get((req, res) => {
    User.findById(req.params.user_id, function (err, user) {
      if (err) throw err;
      res.status(200).json(user);
    });
  })
  .put((req, res) => {
    User.findById(req.params.user_id, function (err, user) {
      if (err) throw err;
      user.name = req.body.name;
      user.age = req.body.age;
      user.save(function (err, user) {
        if (err) throw err;
        res.status(200).json(user);
      });
    });
  })
  .delete((req, res) => {
    User.deleteOne({ _id: req.params.user_id }, function (err) {
      if (err) throw err;
      res.sendStatus(204);
    });
  });

const server = app.listen(PORT, () => console.log(`Test app listening on port ${PORT}!`));

module.exports = {
  server: server,
  User: User
};
