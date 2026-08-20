const db = require('../models');

const SupportTicket = db.SupportTicket;


/*
|--------------------------------------------------------------------------
| Support Role IDs
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Replace these values with your actual role IDs.
|
*/

const ROLES = {

    ADMIN: 1,

    SUPPORT: 2,

    DEVELOPER: 3

};


/*
|--------------------------------------------------------------------------
| Get Role ID
|--------------------------------------------------------------------------
*/

const getUserRoleId = (req) => {

    return Number(req.user?.role_id);

};


/*
|--------------------------------------------------------------------------
| Allow Roles
|--------------------------------------------------------------------------
*/

const allowRoles = (...allowedRoles) => {

    return (req, res, next) => {

        try {

            if (!req.user) {

                return res.status(401).json({

                    success: false,

                    message: 'Unauthorized'

                });

            }


            const roleId =
                getUserRoleId(req);


            if (
                !allowedRoles.includes(roleId)
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        'You do not have permission to perform this action'

                });

            }


            next();

        } catch (error) {

            console.error(
                'Role authorization error:',
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    'Authorization failed'

            });

        }

    };

};


/*
|--------------------------------------------------------------------------
| Check Ticket Access
|--------------------------------------------------------------------------
|
| ADMIN
|   Everything
|
| SUPPORT
|   All support tickets
|
| DEVELOPER
|   Assigned tickets only
|
*/

const checkTicketAccess = async (
    req,
    res,
    next
) => {

    try {

        const userId =
            req.user?.id;

        const roleId =
            getUserRoleId(req);

        const ticketId =
            req.params.id;


        if (!userId) {

            return res.status(401).json({

                success: false,

                message:
                    'User ID not found in token'

            });

        }


        if (!ticketId) {

            return res.status(400).json({

                success: false,

                message:
                    'Ticket ID is required'

            });

        }


        const ticket =
            await SupportTicket.findByPk(
                ticketId
            );


        if (!ticket) {

            return res.status(404).json({

                success: false,

                message:
                    'Ticket not found'

            });

        }


        /*
        |--------------------------------------------------------------------------
        | ADMIN
        |--------------------------------------------------------------------------
        */

        if (
            roleId === ROLES.ADMIN
        ) {

            req.ticket = ticket;

            return next();

        }


        /*
        |--------------------------------------------------------------------------
        | SUPPORT
        |--------------------------------------------------------------------------
        */

        if (
            roleId === ROLES.SUPPORT
        ) {

            req.ticket = ticket;

            return next();

        }


        /*
        |--------------------------------------------------------------------------
        | DEVELOPER
        |--------------------------------------------------------------------------
        */

        if (
            roleId === ROLES.DEVELOPER
        ) {

            if (
                String(ticket.assigned_to) !==
                String(userId)
            ) {

                return res.status(403).json({

                    success: false,

                    message:
                        'You can only access tickets assigned to you'

                });

            }


            req.ticket = ticket;

            return next();

        }


        return res.status(403).json({

            success: false,

            message:
                'Invalid user role'

        });


    } catch (error) {

        console.error(
            'Ticket access error:',
            error
        );

        return res.status(500).json({

            success: false,

            message:
                'Unable to verify ticket access'

        });

    }

};


module.exports = {

    ROLES,

    allowRoles,

    checkTicketAccess,

    getUserRoleId

};