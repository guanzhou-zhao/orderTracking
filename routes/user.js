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
      var roleName = ''
      var className = ''
      switch (u.role) {
        case 1:
          roleName = '买手';
          className = 'success';
          break;
        case 10:
          roleName = '金主';
          className = 'warning';
          break;
        case 100:
          roleName = '管理员';
          className = 'danger';
          break;
        default:
          roleName = '末知';
          break;
      }
      u.roleName = roleName
      u.className = className
      return u;
    });
    // console.log(`===route user.post /resetpass :: ${JSON.stringify(req.body)}`)
    res.render('user', data)
  })
});
router.get('/delete/:id', function (req, res) {
  User
    .delById(req.params.id)
    .then(function(numberOfDeletedRows) {

      res.send({numberOfDeletedRows})
    })
})
router.post('/edit', function(req, res) {
  User
    .patchById(req.body)
    .then(function(updatedUser) {
      res.redirect('/user')
    })
})
router.post('/resetpass', function(req, res) {
  console.log(`===route user.post /resetpass :: ${JSON.stringify(req.body)}`)
  User
    .patchPassByAdmin(req.body.id, req.body.newpass)
    .then(function(updatedUser) {
      res.send(updatedUser)
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
