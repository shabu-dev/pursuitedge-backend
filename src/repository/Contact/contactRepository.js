const db = require('../../models');
const Contact = db.Contact;

//Create

const createContact = async (data) => {
    return await Contact.create(data);
};

// Get All

const getContacts = async () => {
    return await Contact.findAll({
        order: [
            ['createdAt', 'DESC']
        ]
    });
};

// Get By ID
const getContactById = async (id) => {
    return await Contact.findByPk(id);
};

//Update Status
const updateContactStatus = async ( id, status) => {
    const contact = await Contact.findByPk(id);
    if (!contact) {
        throw new Error('Contact enquiry not found');
    }
    await contact.update({status});
    return contact;
};

// Delete

const deleteContact = async (id) => {
    const contact = await Contact.findByPk(id);
    if (!contact) 
    {
        throw new Error('Contact enquiry not found');
    }
    await contact.destroy();
    return contact;
};


module.exports = {
    createContact,
    getContacts,
    getContactById,
    updateContactStatus,
    deleteContact
};