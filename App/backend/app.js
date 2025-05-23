require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var onboardingRouter = require('./routes/onboarding');
var buyerOnboardingRouter = require('./routes/buyerOnboarding');
var adminRouter = require('./routes/admin');
var adminUsersRouter = require('./routes/adminUsers');
var marketplaceRouter = require('./routes/marketplace');
var messagingRouter = require('./routes/messaging');
var tradeRouter = require('./routes/trade');
const waitlistRouter = require('./routes/waitlist');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/onboarding', onboardingRouter);
app.use('/onboarding', buyerOnboardingRouter);
app.use('/admin', adminRouter);
app.use('/admin', adminUsersRouter);
app.use('/marketplace', marketplaceRouter);
app.use('/marketplace/messages', messagingRouter);
app.use('/marketplace/trades', tradeRouter);
app.use('/api/waitlist', waitlistRouter);

module.exports = app;
