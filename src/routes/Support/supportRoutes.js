const express = require('express');

const router = express.Router();

const auth =
    require('../../middleware/auth');
    const upload =
    require('../../middleware/supportUpload');

const ticketController =
    require('../../controller/Support/ticketController');

const messageController =
    require('../../controller/Support/ticketMessageController');

const historyController =
    require('../../controller/Support/ticketHistoryController');

    const attachmentController =
    require('../../controller/Support/ticketAttachmentController');


// =====================================
// TICKETS
// =====================================

router.post(
    '/ticket/create',
    auth,
    ticketController.createTicket
);


router.get(
    '/ticket/get',
    auth,
    ticketController.getTickets
);


router.get(
    '/ticket/my',
    auth,
    ticketController.getMyTickets
);


router.get(
    '/ticket/:id',
    auth,
    ticketController.getTicketById
);


// =====================================
// ASSIGNMENT
// =====================================

router.put(
    '/ticket/:id/assign',
    auth,
    ticketController.assignTicket
);


// =====================================
// STATUS
// =====================================

router.put(
    '/ticket/:id/status',
    auth,
    ticketController.updateStatus
);


// =====================================
// PRIORITY
// =====================================

router.put(
    '/ticket/:id/priority',
    auth,
    ticketController.updatePriority
);


// =====================================
// MESSAGES
// =====================================

router.post(
    '/ticket/:id/message',
    auth,
    messageController.createMessage
);


router.get(
    '/ticket/:id/messages',
    auth,
    messageController.getMessages
);


// =====================================
// HISTORY
// =====================================

router.get(
    '/ticket/:id/history',
    auth,
    historyController.getHistory
);


// =====================================
// ATTACHMENTS
// =====================================

router.post(
    '/ticket/:id/attachment',
    auth,
    upload.array('files', 5),
    attachmentController.uploadAttachments
);


router.get(
    '/attachment/:id',
    auth,
    attachmentController.downloadAttachment
);


router.delete(
    '/attachment/:id',
    auth,
    attachmentController.deleteAttachment
);

module.exports = router;