var express = require('express');
var router = express.Router();

const flayService = require('../public/js/flay/flayService');

router.get('/list', function (req, res, next) {
  const files = flayService.list();
  res.json(files);
});

router.use('/:id', function (req, res, next) {
  const file = flayService.get(req.params.id);
  res.json(file);
});

module.exports = router;
