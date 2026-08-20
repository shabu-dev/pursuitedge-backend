const db = require('../../models');

const TicketHistory = db.SupportTicketHistory;


const createHistory = async (data) => {

    return await TicketHistory.create(data);
};


const getHistoryByTicket = async (ticketId) => {

    return await TicketHistory.findAll({
        where: {
            ticket_id: ticketId
        },
        order: [['createdAt', 'DESC']]
    });
};


module.exports = {
    createHistory,
    getHistoryByTicket
};