/**
 * @requestMapping(/api)
 */

import { Router } from 'express';
import path from 'path';

import flayService from '../flayground/service/flayService.js';
import videoService from '../flayground/service/videoService.js';
import actressService from '../flayground/service/actressService.js';
import tagService from '../flayground/service/tagService.js';

const router = Router();

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

router.post('/flay/:opus/play', function (req, res, next) {
	flayService.play(req.params.opus);
	res.status(204).send();
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

router.post('/video', function (req, res, next) {
	videoService.save(req.body);
	res.status(204).send();
});

/* ---- cover ---- */

router.get('/cover/:opus', function (req, res, next) {
	const flay = flayService.get(req.params.opus);
	res.sendFile(path.resolve(flay.files.cover.path, flay.files.cover.name));
});

/* ---- actress ---- */

router.get('/actress', function (req, res, next) {
	const list = actressService.list();
	res.json(list);
});

router.get('/actress/:name', function (req, res, next) {
	const actress = actressService.get(req.params.name);
	res.json(actress);
});

router.post('/actress', function (req, res, next) {
	actressService.save(req.body);
	res.status(204).send();
});

/* ---- tag ---- */

router.get('/tag', function (req, res, next) {
	const list = tagService.list();
	res.json(list);
});

router.get('/tag/:id', function (req, res, next) {
	const tag = tagService.get(req.params.id);
	res.json(tag);
});

router.post('/tag', function (req, res, next) {
	tagService.save(req.body);
	res.status(204).send();
});

export default router;
