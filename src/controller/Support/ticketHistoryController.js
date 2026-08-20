const ticketRepository =
    require('../../repository/Support/ticketRepository');

const historyRepository =
    require('../../repository/Support/ticketHistoryRepository');


const getHistory = async (req, res) => {

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


        const history =
            await historyRepository
                .getHistoryByTicket(id);


        return res.status(200).json({

            success: true,

            history

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });
    }
};


module.exports = {

    getHistory

};