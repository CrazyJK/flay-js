const express = require('express');
const router = express.Router();

const flayService = require('../flayground/service/flayService');

router.get('/', (req, res, next) => {
	res.render('flay', { title: 'Flay' });
});

router.get('/list', (req, res, next) => {
	const files = flayService.list();
	res.json(files);
});

router.use('/:id', function (req, res, next) {
	const file = flayService.get(req.params.id);
	res.json(file);
});

module.exports = router;
