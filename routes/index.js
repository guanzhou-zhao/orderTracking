var router = require('express').Router()
var passport = require('passport')
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
var log = require('debug')('routes:index:log')

var taskRouter = require('./task')
var orderRouter = require('./order')
var userRouter = require('./user')
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

router.use(ensureLoggedIn())

router.get('/', function (req, res) {
  res.redirect('/order')
});
router.use('/task', taskRouter)
router.use('/order', orderRouter)
router.use('/user', userRouter)
