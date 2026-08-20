const express = require('express');
const router = express.Router();
const contactController = require('../../controller/Contact/contactController');
const auth = require('../../middleware/auth');

router.post( '/create', contactController.createContact);
router.get( '/get', auth, contactController.getContacts);
router.get( '/get/:id', auth, contactController.getContactById);
router.put( '/status/:id', auth, contactController.updateContactStatus);
router.delete( '/delete/:id', auth, contactController.deleteContact);


module.exports = router;