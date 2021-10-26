var express = require('express');
var router = express.Router();

const fileLecture = require('../public/js/utils/FileUtils');

router.get('/list', function (req, res, next) {
  console.log('req.params', req.query);
  const files = fileLecture(req.query.path);
  res.json(files);
});

module.exports = router;
