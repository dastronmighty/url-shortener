const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const api = require('./routes/api');
const get = require('./routes/get');
const settings = require('./settings/settings');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/web', express.static(__dirname + '/static/web'));
app.use('/api', api);
app.use('/', get);

const server = app.listen(settings.port, function() {
  const base = settings.getBaseURL();

  console.log(`Example app listening at ${base}`);
});
