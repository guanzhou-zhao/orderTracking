var express = require('express');
var exphbs = require('express-handlebars')
var expressSession = require('express-session')
var bodyParser = require('body-parser')
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
var knex = require('./db')
var KnexSessionStore = require('connect-session-knex')(expressSession)
var flash = require('connect-flash')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('./lib/bcrypt')
var User = require('./models/user')
var index = require('./routes')
var app = express();

app.use( bodyParser.urlencoded({ extended: true }) );
// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
    defaultLayout: 'main',
    // Uses multiple partials dirs, templates in "shared/templates/" are shared
    // with the client-side of the app (see below).
    partialsDir: [
        'views/partials/'
    ]
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

var sess = {
  resave: false,
  saveUninitialized: false,
  secret: 'keyboard cat 8)',
  cookie: {},
  store: new KnexSessionStore({ knex: knex })
}
app.use(expressSession(sess))
app.use(flash())

passport.use(new LocalStrategy(User.verifyUser));
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index)
module.exports = app
