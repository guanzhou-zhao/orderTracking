var router = require('express').Router()
var passport = require('passport')
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
var log = require('debug')('routes:index:log')
var _ = require('lodash')
var User = require('../models/user')

var taskRouter = require('./task')
var orderRouter = require('./order')
module.exports = router

router.get('/login', function (req, res, next) {
  res.render('login', {flash: req.flash('error')})
})
router.post('/login',
  passport.authenticate('local', {
      successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true })
);
router.get('/logout', function (req, res, next) {
  req.logout()
  res.redirect('/login')
})
router.get('/register', function (req, res) {
  res.render('register', { flash: req.flash('error') })
})

router.use(ensureLoggedIn())

router.get('/', function (req, res) {
  res.redirect('/order')
});
router.use('/task', taskRouter)
router.use('/order', orderRouter)


router.get('/user', function (req, res) {
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
router.post('/register',
  function (req, res, next) {
    User.getByUsername(req.body.username)
      .then(function (users) {
        //console.log(users)
        //log(users)
        if (!_.isEmpty(users)) {
          req.flash('error', 'User already exists, sorry.')
          return res.redirect('/register')
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
    res.redirect('/register')
  }
)
