var router = require('express').Router()
var Order = require('../models/order')
var moment = require('moment')
var _ = require('lodash')

module.exports = router

router.get('/', function (req, res) {
  console.log('req.query: ', req.query)
  var isAdmin = req.user.username == 'rosfiled'
  var data = {
    error: req.flash('error'),
    isAdmin,
    user: req.user,
    isOrder: true
  }
  Order.getByUsername(req.user.username, isAdmin).then((orders) => {
    
    data.orders = orders.map(order => {
      order.created_at = moment(order.created_at).format('YYYY-MM-D HH:mm:ss')
      order.order_json_string = JSON.stringify(order)
      return order
    });
    res.render('order', data)
  })
});

router.post('/',
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
