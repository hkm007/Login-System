const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const PORT = process.env.PORT || 5000;

// Passport Config
require('./config/passport')(passport);

// DB config
const db = require('./config/keys').MongoURI;
mongoose.connect(db, { useNewUrlParser: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.log(err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// bodyParser middleware
app.use(express.urlencoded({ extended: false }));

// express-session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use("/", require('./routes/index'));
app.use("/users", require('./routes/users'));

app.listen(PORT, console.log(`Server running on port ${PORT}`));