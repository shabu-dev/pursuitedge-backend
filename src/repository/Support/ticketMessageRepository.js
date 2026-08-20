const db = require('../../models');

const TicketMessage = db.SupportTicketMessage;


const createMessage = async (data) => {

    return await TicketMessage.create(data);
};

const getMessageById = async (id) => {

    return await TicketMessage.findByPk(id);

};
const getMessagesByTicket = async (ticketId) => {

    return await TicketMessage.findAll({
        where: {
            ticket_id: ticketId
        },
        order: [['createdAt', 'ASC']]
    });
};


module.exports = {
    createMessage,
        getMessageById,

    getMessagesByTicket
};