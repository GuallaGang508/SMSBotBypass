const express = require('express');
const morgan = require('morgan');

const voice = require('./routes/voice');
const status = require('./routes/status');
const call = require('./routes/call');
const sms = require('./routes/sms');
const get = require('./routes/get');
const stream = require('./routes/stream');

const auth = require('./middleware/authentification');

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

app.post('/voice', voice);
app.post('/status', status);
app.post('/call', auth, call);
app.post('/sms', auth, sms);
app.post('/get', auth, get);
app.get('/stream/:service', stream);

module.exports = app;