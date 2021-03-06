const User = require('../models/Admin');

module.exports = {
  create: function(req, res) {
    var userInfo = req.body
    User.create(userInfo, (err, user) => {
      if (err) { return res.status(500).send(err); }
      return res.status(201).send(user);
    })
  },

  readAll: function(req, res) {
    User.find({}, (err, users) => {
      if (err) { return res.status(500).send(err); }
      return res.send(200, users)
    });
  },

  readOne: function(req, res) {
    User.findById(req.param('adminId'), (err, user) => {
      if (err) { return res.status(500).send(err); }
      return res.send(200, user)
    });
  },

  update: function(req, res) {
    var userInfo = req.body
    User.update({ _id: req.param('adminId') }, userInfo, (err, user) => {
      if (err) { return res.status(500).send(err); }
      return res.status(201).send(user);
    })
  }
}
