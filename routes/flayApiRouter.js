/**
 * @requestMapping(/api)
 */

const path = require('path');
const express = require('express');
const router = express.Router();

const flayService = require('../flayground/service/flayService');
const videoService = require('../flayground/service/videoService');
const actressService = require('../flayground/service/actressService');

/* ---- file ---- */

router.get('/listFiles', (req, res, next) => {
	const files = flayService.listFiles();
	res.json(files);
});

/* ---- flay ---- */

router.get('/flay/map', (req, res, next) => {
	const flayMap = flayService.getMap();
	const jsonData = Object.fromEntries(flayMap);
	res.json(jsonData);
});

router.get('/flay/list', (req, res, next) => {
	const flayList = flayService.list();
	res.json(flayList);
});

router.get('/flay/:opus', function (req, res, next) {
	const flay = flayService.get(req.params.opus);
	res.json(flay);
});

/* ---- video ---- */

router.get('/video', function (req, res, next) {
	const list = videoService.list();
	res.json(list);
});

router.get('/video/:opus', function (req, res, next) {
	const video = videoService.get(req.params.opus);
	res.json(video);
});

/* ---- cover ---- */

router.get('/cover/:opus', function (req, res, next) {
	const flay = flayService.get(req.params.opus);
	res.sendFile(path.resolve(flay.files.cover.path, flay.files.cover.name));
});

/* ---- cover ---- */

router.get('/actress/:name', function (req, res, next) {
	const actress = actressService.get(req.params.name);
	res.json(actress);
});

module.exports = router;
