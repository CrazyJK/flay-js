/**
 * @requestMapping(/api)
 */

import { Router } from 'express';
import path from 'path';

import flayService from '../service/flayService.js';
import videoService from '../service/videoService.js';
import actressService from '../service/actressService.js';
import tagService from '../service/tagService.js';
import historyService from '../service/historyService.js';

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
    const flay = flayService.play(req.params.opus);
    process.emit('update flay', flay);
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
    const video = videoService.save(req.body);
    // assamble flay
    const flay = flayService.get(video.opus);
    flay.video = video;
    process.emit('update flay', flay);
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
    const actress = actressService.save(req.body);
    process.emit('update actress', actress);
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
    const tag = tagService.save(req.body);
    process.emit('update tag', tag);
    res.json(tag);
});

/* ---- hsitory ---- */

router.get('/history/:keyword', function (req, res, next) {
    const histories = historyService.find(req.params.keyword);
    res.json(histories);
});

router.get('/history/date/:date', function (req, res, next) {
    const histories = historyService.getDate(req.params.date);
    res.json(histories);
});

router.get('/history/opus/:opus', function (req, res, next) {
    const histories = historyService.getOpus(req.params.opus);
    res.json(histories);
});

router.get('/history/action/:action', function (req, res, next) {
    const histories = historyService.getAction(req.params.action);
    res.json(histories);
});

export default router;
