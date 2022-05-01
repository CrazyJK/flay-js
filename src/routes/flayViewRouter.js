/**
 * @requestMapping(/flay)
 */

import { Router } from 'express';

const router = Router();

// VIEW
router.get('/home', (req, res) => {
  res.render('flay/flayHome', { title: 'Flay' });
});

router.get('/file', (req, res) => {
  res.render('flay/flayFiles', { title: 'Flay files' });
});

router.get('/list', (req, res) => {
  res.render('flay/flayList', { title: 'Flay list' });
});

router.get('/manager', (req, res) => {
  res.render('flay/flayManager', { title: 'Flay Manager' });
});

// POPUP
router.get('/actress/:name', (req, res) => {
  res.render('flay/actress', { layout: 'popup', name: req.params.name, title: req.params.name });
});

export default router;
