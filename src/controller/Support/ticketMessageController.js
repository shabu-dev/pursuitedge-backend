const ticketRepository =
    require('../../repository/Support/ticketRepository');

const messageRepository =
    require('../../repository/Support/ticketMessageRepository');

const historyRepository =
    require('../../repository/Support/ticketHistoryRepository');


const createMessage = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            message,
            sender_type,
            message_type
        } = req.body;


        const senderId = req.user?.id;


        if (!senderId) {

            return res.status(401).json({

                success: false,

                message: 'Unauthorized'

            });
        }


        if (!message) {

            return res.status(400).json({

                success: false,

                message: 'Message is required'

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


        const ticketMessage =
            await messageRepository.createMessage({

                ticket_id: id,

                sender_id: senderId,

                sender_type:
                    sender_type || 'DEVELOPER',

                message,

                message_type:
                    message_type || 'PUBLIC_MESSAGE'

            });


        await historyRepository.createHistory({

            ticket_id: id,

            action: 'MESSAGE_ADDED',

            old_value: null,

            new_value: message,

            performed_by: senderId

        });


        return res.status(201).json({

            success: true,

            message:
                'Message added successfully',

            ticketMessage

        });

    } catch (error) {

        console.error(
            'Create message error:',
            error
        );

        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


const getMessages = async (req, res) => {

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


        const messages =
            await messageRepository
                .getMessagesByTicket(id);


        return res.status(200).json({

            success: true,

            messages

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


module.exports = {

    createMessage,

    getMessages

};