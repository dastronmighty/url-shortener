var express = require('express');
var router = express.Router();

var db = require('../models/database.js');
var settings = require('../settings/settings');

router.get('/', function(req, res) {
  res.redirect(301, settings.rootredirect);
});

router.get('/unknown/:short', function(req, res) {
  const message = `Error: Unknown short code ${
    req.params.short
  }`;
  res.status(404).render('pages/404', { message: message });
  console.log(message);
});

router.get('/:short', function(req, res) {
  db.get(req.params.short, function(url) {
    if (url) {
      console.log(
        'code ' + req.params.short + ' -> ' + url
      );
      res.redirect(301, url.url);
    } else {
      res.redirect(301, '/unknown/' + req.params.short);
    }
  });
});

// Export router object for use in express
module.exports = router;
