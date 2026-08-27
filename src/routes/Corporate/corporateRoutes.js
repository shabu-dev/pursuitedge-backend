const express = require('express');
const router = express.Router();
const corporateController = require('../../controller/Corporate/corporateController');
const auth = require('../../middleware/auth');

router.post('/create', corporateController.createCorporate);
router.get('/get', auth, corporateController.getCorporates);
router.get('/get/:id', auth, corporateController.getCorporateById);

module.exports = router;