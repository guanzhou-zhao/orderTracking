var router = require('express').Router()
var passport = require('passport')
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
var log = require('debug')('routes:index:log')
var _ = require('lodash')
var User = require('../models/user')
var Order = require('../models/order')
var moment = require('moment');
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
router.get('/task', function (req, res) {
  res.render('task', {user: req.user, isTask: true})
});
router.get('/order', function (req, res) {
  console.log('req.query: ', req.query)
  var isAdmin = req.user.username == 'rosfiled'
  var data = {
    error: req.flash('error'),
    isAdmin,
    user: req.user,
    isOrder: true
  }
  Order.getByUsername(req.user.username, isAdmin).then((orders) => {
    var ordersDate = orders.map(order => {
      return moment(order.created_at).format('YYYY')
    })
    console.log(`order dates: ${JSON.stringify(ordersDate)}`)
    data.orders = orders.map(order => {
      order.created_at = moment(order.created_at).format('YYYY-MM-D HH:mm:ss')
      return order
    });
    res.render('order', data)
  })
});
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
router.post('/register', ensureLoggedIn(),
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
router.post('/order', ensureLoggedIn(),
  function (req, res, next) {
    var newOrder = req.body
    Order.getByOrderNum(newOrder.ordernum)
      .then(function (orders) {
        //console.log(orders)
        //log(orders)
        if (!_.isEmpty(orders)) {
          req.flash('error', '该订单号已添加')
          return res.redirect('/')
        }

        // req.login() can be used to automatically log the user in after registering
        console.log(`add new order: user: ${JSON.stringify(req.user)}`)
        Order.add(newOrder.shopname.trim(), newOrder.keyword.trim(), newOrder.price.trim(), newOrder.ordernum.trim(), req.user.username)
          .then(function () { return res.redirect('/')} )
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
    req.flash('error', "添加新订单失败")
    res.redirect('/')
  }
)
