const ticketRepository = require('../../repository/Support/ticketRepository');
const historyRepository = require('../../repository/Support/ticketHistoryRepository');


// Generate ticket number
const generateTicketNumber = async () => {
    const year = new Date().getFullYear();
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `PE-${year}-${randomNumber}`;
};


// ===============================
// CREATE TICKET
// ===============================

const createTicket = async (req, res) => {

    try {
        const { subject, description, category, priority } = req.body;
        if (!subject || !description || !category) {
            return res.status(400).json({ success: false, message: 'Subject, description and category are required'});
        }
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({success: false, message: 'Unauthorized'});
        }
        const ticketNumber = await generateTicketNumber();
        const ticket = await ticketRepository.createTicket({ ticket_number: ticketNumber, created_by: userId, subject, description, category, priority: priority || 'MEDIUM', status: 'OPEN' });
        await historyRepository.createHistory({ ticket_id: ticket.id, action: 'TICKET_CREATED', old_value: null, new_value: 'OPEN', performed_by: userId});
        return res.status(201).json({ success: true, message:'Support ticket created successfully', ticket });

    } catch (error) {
        console.error('Create ticket error:',error);
        return res.status(500).json({ success: false, message: error.message});
    }
};


// ===============================
// GET ALL TICKETS
// ===============================

const getTickets = async (req, res) => {

    try {

        const {
            page = 1,
            limit = 10,
            status,
            priority,
            category,
            assigned_to
        } = req.query;


        const result =
            await ticketRepository.getTickets({

                page,
                limit,
                status,
                priority,
                category,
                assigned_to

            });


        return res.status(200).json({

            success: true,

            message:
                'Support tickets fetched successfully',

            total: result.count,

            page: Number(page),

            limit: Number(limit),

            tickets: result.rows

        });

    } catch (error) {

        console.error(
            'Get tickets error:',
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


// ===============================
// GET MY TICKETS
// ===============================

const getMyTickets = async (req, res) => {

    try {

        const userId = req.user?.id;

        if (!userId) {

            return res.status(401).json({

                success: false,

                message: 'Unauthorized'

            });
        }


        const {
            page = 1,
            limit = 10
        } = req.query;


        const result =
            await ticketRepository.getMyTickets({

                userId,

                page,

                limit

            });


        return res.status(200).json({

            success: true,

            total: result.count,

            page: Number(page),

            limit: Number(limit),

            tickets: result.rows

        });

    } catch (error) {

        console.error(
            'Get my tickets error:',
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


// ===============================
// GET SINGLE TICKET
// ===============================

const getTicketById = async (req, res) => {

    try {

        const { id } = req.params;


        const ticket =
            await ticketRepository.getTicketById(id);


        if (!ticket) {

            return res.status(404).json({

                success: false,

                message: 'Ticket not found'

            });
        }


        return res.status(200).json({

            success: true,

            ticket

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


// ===============================
// ASSIGN TICKET
// ===============================

const assignTicket = async (req, res) => {

    try {

        const { id } = req.params;

        const { assigned_to } = req.body;

        const userId = req.user?.id;


        if (!assigned_to) {

            return res.status(400).json({

                success: false,

                message:
                    'assigned_to is required'

            });
        }


        const ticket =
            await ticketRepository.getTicketById(id);


        if (!ticket) {

            return res.status(404).json({

                success: false,

                message: 'Ticket not found'

            });
        }


        const oldValue =
            ticket.assigned_to;


        await ticketRepository.updateTicket(

            id,

            {
                assigned_to,
                status: 'ASSIGNED'
            }

        );


        await historyRepository.createHistory({

            ticket_id: id,

            action: 'TICKET_ASSIGNED',

            old_value: oldValue,

            new_value: assigned_to,

            performed_by: userId

        });


        return res.status(200).json({

            success: true,

            message:
                'Ticket assigned successfully'

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


// ===============================
// CHANGE STATUS
// ===============================

const updateStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { status } = req.body;

        const userId = req.user?.id;

        const role =
            String(req.user?.role || '').toUpperCase();


        const allowedStatuses = [
            'OPEN',
            'ASSIGNED',
            'IN_PROGRESS',
            'WAITING_FOR_SUPPORT',
            'RESOLVED',
            'CLOSED'
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                success: false,

                message: 'Invalid status'

            });

        }


        const ticket =
            await ticketRepository.getTicketById(id);


        if (!ticket) {

            return res.status(404).json({

                success: false,

                message: 'Ticket not found'

            });

        }


        /*
        |--------------------------------------------------------------------------
        | Developer can only update assigned ticket
        |--------------------------------------------------------------------------
        */

        if (role === 'DEVELOPER') {

            if (
                String(ticket.assigned_to) !==
                String(userId)
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        'You can only update your assigned tickets'

                });

            }

        }


        const oldStatus =
            ticket.status;


        /*
        |--------------------------------------------------------------------------
        | Status transition validation
        |--------------------------------------------------------------------------
        */

        const allowedTransitions = {

            OPEN: [
                'ASSIGNED',
                'IN_PROGRESS'
            ],

            ASSIGNED: [
                'IN_PROGRESS'
            ],

            IN_PROGRESS: [
                'WAITING_FOR_SUPPORT',
                'RESOLVED'
            ],

            WAITING_FOR_SUPPORT: [
                'IN_PROGRESS',
                'RESOLVED'
            ],

            RESOLVED: [
                'CLOSED',
                'IN_PROGRESS'
            ],

            CLOSED: [
                'OPEN'
            ]

        };


        const possibleStatuses =
            allowedTransitions[
                oldStatus
            ] || [];


        /*
         * Admin can reopen/modify anything.
         */

        if (
            role !== 'ADMIN' &&
            !possibleStatuses.includes(status)
        ) {

            return res.status(400).json({

                success: false,

                message:
                    `Cannot change ticket from ${oldStatus} to ${status}`

            });

        }


        const updateData = {
            status
        };


        if (status === 'RESOLVED') {

            updateData.resolved_at =
                new Date();

        }


        if (status === 'CLOSED') {

            updateData.closed_at =
                new Date();

        }


        /*
         * Reopen ticket
         */

        if (status === 'OPEN') {

            updateData.resolved_at = null;

            updateData.closed_at = null;

        }


        await ticketRepository.updateTicket(
            id,
            updateData
        );


        await historyRepository.createHistory({

            ticket_id: id,

            action: 'STATUS_CHANGED',

            old_value: oldStatus,

            new_value: status,

            performed_by: userId

        });


        return res.status(200).json({

            success: true,

            message:
                'Ticket status updated successfully'

        });


    } catch (error) {

        console.error(
            'Update status error:',
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ===============================
// CHANGE PRIORITY
// ===============================

const updatePriority = async (req, res) => {

    try {

        const { id } = req.params;

        const { priority } = req.body;

        const userId = req.user?.id;


        const allowedPriority = [

            'LOW',

            'MEDIUM',

            'HIGH',

            'URGENT'

        ];


        if (!allowedPriority.includes(priority)) {

            return res.status(400).json({

                success: false,

                message: 'Invalid priority'

            });
        }


        const ticket =
            await ticketRepository.getTicketById(id);


        if (!ticket) {

            return res.status(404).json({

                success: false,

                message: 'Ticket not found'

            });
        }


        const oldPriority =
            ticket.priority;


        await ticketRepository.updateTicket(

            id,

            {
                priority
            }

        );


        await historyRepository.createHistory({

            ticket_id: id,

            action: 'PRIORITY_CHANGED',

            old_value: oldPriority,

            new_value: priority,

            performed_by: userId

        });


        return res.status(200).json({

            success: true,

            message:
                'Ticket priority updated successfully'

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


module.exports = {

    createTicket,

    getTickets,

    getMyTickets,

    getTicketById,

    assignTicket,

    updateStatus,

    updatePriority

};