const express = require("express");
const router = express.Router();
const countryController = require('../../controller/Country/countryController');

router.post('/create', countryController.createCountry);
router.get('/get',countryController.getCountry);
router.put('/update/:id',countryController.updateCountry);
router.delete('/delete/:id',countryController.deleteCountry);


module.exports = router;
