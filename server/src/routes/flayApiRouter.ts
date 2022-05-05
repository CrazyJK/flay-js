/**
 * @requestMapping(/api)
 */

import { Router } from 'express';

import flayService from '../service/flayService.js';
import videoService from '../service/videoService.js';
import actressService from '../service/actressService.js';
import tagService from '../service/tagService.js';
import historyService from '../service/historyService.js';
import batchService from '../service/batchService.js';
import candidatesService from '../service/candidatesService.js';
import getDominatedColors from '../service/dominatedColorsService.js';
import idEmitter from './ioEmitter';

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
  idEmitter.flay.emit('updateFlay', flay);
  res.status(204).send();
});

router.get('/flay/find/:keyword', (req, res, next) => {
  const found = flayService.findByKeyword(req.params.keyword);
  res.json(found);
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

// create
router.post('/video', function (req, res, next) {
  const video = videoService.save(req.body);
  // assamble flay if exists
  const flay = flayService.find(video.opus);
  if (flay) {
    flay.video = video;
    idEmitter.flay.emit('updateFlay', flay);
  }
  res.status(204).send();
});

// update
router.put('/video', function (req, res, next) {
  const video = videoService.save(req.body);
  // assamble flay
  const flay = flayService.get(video.opus);
  flay.video = video;
  idEmitter.flay.emit('updateFlay', flay);
  res.status(204).send();
});

router.get('/video/find/:keyword', (req, res) => {
  const found = videoService.find(req.params.keyword);
  res.json(found);
});

/* ---- cover ---- */

router.get('/cover/:opus', function (req, res, next) {
  const flay = flayService.get(req.params.opus);
  res.sendFile(flay.files.cover.filepath);
});

router.get('/cover/color/:opus', async (req, res) => {
  const flay = flayService.get(req.params.opus);
  const colors = await getDominatedColors(flay.files.cover.filepath);
  res.json(colors);
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

router.get('/actress/localName/:localName', (req, res) => {
  const actressList = actressService.findLocalName(decodeURI(req.params.localName));
  res.json(actressList);
});

router.post('/actress', function (req, res, next) {
  const actress = actressService.save(req.body);
  idEmitter.actress.emit('updateActress', actress);
  res.status(204).send();
});

/* ---- studio ---- */

router.get('/studio/guess/:opusPrefix', (req, res) => {
  const studio = flayService.guessStudio(req.params.opusPrefix);
  res.send(studio);
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
  idEmitter.tag.emit('updateTag', tag);
  res.json(tag);
});

/* ---- hsitory ---- */

router.get('/history/find/:keyword', function (req, res, next) {
  const found = historyService.find(req.params.keyword);
  res.json(found);
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

/* ---- batch ---- */

router.post('/batch/instance', (req, res) => {
  batchService.instance();
  // emit batch TODO
  res.status(204).send();
});

router.post('/batch/reload', (req, res) => {
  batchService.reload();
  // emit reload TODO
  res.status(204).send();
});

/* ---- candidates ---- */

router.get('/candidates', (req, res) => {
  const list = candidatesService.find();
  res.json(list);
});

router.put('/candidates/:opus', (req, res) => {
  const list = candidatesService.accept(req.params.opus, req.body);
  // emit accept candidates TODO
  res.status(204).send();
});

export default router;
