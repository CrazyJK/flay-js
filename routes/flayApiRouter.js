/**
 * @requestMapping(/api)
 */

const express = require('express');
const router = express.Router();

const flayService = require('../flayground/service/flayService');

router.get('/listFiles', (req, res, next) => {
	const files = flayService.listFiles();
	res.json(files);
});

router.get('/flayMap', (req, res, next) => {
	const flayMap = flayService.getMap();
	const jsonData = Object.fromEntries(flayMap);
	res.json(jsonData);
});

router.use('/:id', function (req, res, next) {
	const file = flayService.get(req.params.id);
	res.json(file);
});

module.exports = router;
