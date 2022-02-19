/**
 * @requestMapping(/flay)
 */

const express = require('express');
const router = express.Router();

// VIEW
router.get('/', (req, res, next) => {
	res.render('flay/flayHome', { title: 'Flay' });
});

router.get('/file', (req, res, next) => {
	res.render('flay/flayFiles', { title: 'Flay files' });
});

router.get('/map', (req, res, next) => {
	res.render('flay/flayMap', { title: 'Flay map' });
});

module.exports = router;
