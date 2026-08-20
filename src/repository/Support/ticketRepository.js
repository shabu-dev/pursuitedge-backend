const db = require('../../models');

const Ticket = db.SupportTicket;

const createTicket = async (data) => {
    return await Ticket.create(data);
};


const getTickets = async ({
    page = 1,
    limit = 10,
    status,
    priority,
    category,
    assigned_to
}) => {

    const where = {};

    if (status) {
        where.status = status;
    }

    if (priority) {
        where.priority = priority;
    }

    if (category) {
        where.category = category;
    }

    if (assigned_to) {
        where.assigned_to = assigned_to;
    }

    const offset = (page - 1) * limit;

    return await Ticket.findAndCountAll({
        where,
        limit: Number(limit),
        offset,
        order: [['createdAt', 'DESC']]
    });
};


const getTicketById = async (id) => {

    return await Ticket.findByPk(id);
};


const getMyTickets = async ({
    userId,
    page = 1,
    limit = 10
}) => {

    const offset = (page - 1) * limit;

    return await Ticket.findAndCountAll({
        where: {
            assigned_to: userId
        },
        limit: Number(limit),
        offset,
        order: [['createdAt', 'DESC']]
    });
};


const updateTicket = async (id, data) => {

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
        throw new Error('Ticket not found');
    }

    await ticket.update(data);

    return ticket;
};


const deleteTicket = async (id) => {

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
        throw new Error('Ticket not found');
    }

    await ticket.destroy();

    return ticket;
};


module.exports = {
    createTicket,
    getTickets,
    getTicketById,
    getMyTickets,
    updateTicket,
    deleteTicket
};