var router = require('express').Router()
var _ = require('lodash')
var User = require('../models/user')

module.exports = router

router.get('/', function (req, res) {
  var isAdmin = req.user.username == 'rosfiled'
  var data = {
    error: req.flash('error'),
    isAdmin,
    user: req.user,
    isUser: true
  }
  User.getAllUsers().then((users) => {
    data.users = users.map(function(u) {
      u.user_json_string = JSON.stringify(u)
      return u;
    });
    res.render('user', data)
  })
});
router.post('/edit', function(req, res) {
  User
    .patchById(req.body)
    .then(function(updatedUser) {
      res.redirect('/user')
    })
})
router.post('/',
  function (req, res, next) {
    User.getByUsername(req.body.username)
      .then(function (users) {

        if (!_.isEmpty(users)) {
          req.flash('error', 'User already exists, sorry.')
          return res.redirect('/user')
        }

        // trim strings before adding to DB
        for (var prop in req.body) {
          req.body[prop] = req.body[prop].trim()
        }

        User.add(req.body)
          .then(function () { return res.redirect('/user')} )
          .catch(function (err) {
            console.error(err)
            next()
          })
      })
      .catch(function (err) {
        console.error(err)
        next()
      })
  },
  function (req, res) {
    req.flash('error', "Couldn't add user.")
    res.redirect('/user')
  }
)
router.post('/changepass', function(req, res) {
  User
    .patchPass(req.user.id, req.body.old_pass, req.body.new_pass)
    .then(updatedUser => {
      console.log(`===_ routes user.post req.body: ${JSON.stringify(req.body)} updatedUser: ${JSON.stringify(updatedUser)}`);
      res.redirect('/user')
    })
    .catch(err => {
      console.log(err.stack);
    });
})
