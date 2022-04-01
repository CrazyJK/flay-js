/**
 * @requestMapping(/flay)
 */

import { Router } from 'express';
const router = Router();

// VIEW
router.get('/home', (req, res, next) => {
	res.render('flay/flayHome', { title: 'Flay' });
});

router.get('/file', (req, res, next) => {
	res.render('flay/flayFiles', { title: 'Flay files' });
});

router.get('/list', (req, res, next) => {
	res.render('flay/flayList', { title: 'Flay list' });
});

export default router;
