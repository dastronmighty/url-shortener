var express = require('express');
var router = express.Router();

var db = require('../models/database');
var settings = require('../settings/settings');

db.connect();

const build_response = (status, message, result) => ({
  status: status,
  message: message,
  result: result
});

const respond = (res, data) => {
  console.log(data);
  res.setHeader('Content-Type', 'application/json');
  res.status(data.status);
  res.send(JSON.stringify(data));
};

router.get('/', function(req, res) {
  const data = build_response(
    200,
    'Welcome to the API',
    null
  );
  respond(res, data);
});

router.get('/check/:short', function(req, res) {
  db.check_short(req.params.short, function(err, url) {
    let data;
    if (url) {
      data = build_response(200, 'Short exists', {
        url: url.url,
        short: url.short,
        baseurl: settings.getBaseURL()
      });
    } else {
      data = build_response(404, 'Short not found', null);
    }
    respond(res, data);
  });
});

router.post('/create/bestapikeyever', function(req, res) {
  console.log(req.body.url);
  if (req.body.url === undefined) {
    console.log('Missing url');
    const data = build_response(400, 'Missing url', null);
    respond(res, data);
  } else {
    console.log('Creating url');
    db.create(req.body.url, req.body.short, function(
      err,
      creation
    ) {
      console.log('DB request made');
      let data;
      if (creation) {
        console.log('Success, short created!');
        data = build_response(
          201,
          'Success, short created!',
          {
            url: creation.url,
            short: creation.short,
            baseurl: settings.getBaseURL(),
            shortUrl: `${settings.getBaseURL()}/${
              creation.short
            }`
          }
        );
      } else {
        console.log('Failed to create');
        data = build_response(
          400,
          'Failed to create: ' + err,
          null
        );
        console.log(data);
      }
      respond(res, data);
    });
  }
});

router.get('/genshort', function(req, res) {
  const short = db.generate_short();
  const data = build_response(200, 'Generated', {
    short: short,
    baseurl: settings.getBaseURL()
  });
  respond(res, data);
});

module.exports = router;
