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

export default router;
