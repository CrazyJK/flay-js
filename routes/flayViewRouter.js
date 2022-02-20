/**
 * @requestMapping(/flay)
 */

const express = require('express');
const router = express.Router();

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

module.exports = router;
