var router = require('express').Router()
var _ = require('lodash')
var User = require('../models/user')

module.exports = router

router.get('/', function (req, res) {
  console.log('req.query: ', req.query)
  var isAdmin = req.user.username == 'rosfiled'
  var data = {
    error: req.flash('error'),
    isAdmin,
    user: req.user,
    isUser: true
  }
  User.getAllUsers().then((users) => {
    data.users = users;
    res.render('user', data)
  })
});
router.post('/',
  function (req, res, next) {
    User.getByUsername(req.body.username)
      .then(function (users) {
        //console.log(users)
        //log(users)
        if (!_.isEmpty(users)) {
          req.flash('error', 'User already exists, sorry.')
          return res.redirect('/user')
        }

        // req.login() can be used to automatically log the user in after registering
        User.add(req.body.username.trim(), req.body.password.trim())
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
