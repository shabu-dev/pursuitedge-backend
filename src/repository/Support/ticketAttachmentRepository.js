const db = require('../../models');

const TicketAttachment =
    db.SupportTicketAttachment;


const createAttachment = async (data) => {

    return await TicketAttachment.create(data);

};


const getAttachmentById = async (id) => {

    return await TicketAttachment.findByPk(id);

};


const getAttachmentsByMessage = async (messageId) => {

    return await TicketAttachment.findAll({

        where: {
            message_id: messageId
        },

        order: [
            ['createdAt', 'ASC']
        ]

    });

};


const deleteAttachment = async (id) => {

    const attachment =
        await TicketAttachment.findByPk(id);

    if (!attachment) {

        throw new Error(
            'Attachment not found'
        );

    }

    await attachment.destroy();

    return attachment;

};


module.exports = {

    createAttachment,

    getAttachmentById,

    getAttachmentsByMessage,

    deleteAttachment

};