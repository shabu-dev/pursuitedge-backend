const express = require("express");
const router = express.Router();
const countryController = require('../../controller/Country/countryController');
const auth = require('../../middleware/auth');


router.post('/create', auth, countryController.createCountry);
router.get('/get', countryController.getCountry);
router.put('/update/:id', auth, countryController.updateCountry);
router.delete('/delete/:id', auth, countryController.deleteCountry);


module.exports = router;
