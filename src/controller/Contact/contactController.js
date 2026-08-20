const contactRepository = require('../../repository/Contact/contactRepository');
const {sendContactEnquiryEmail,sendCustomerConfirmationEmail} = require('../../service/Email/emailService');

const createContact = async (req, res) => {

    try 
    {
        const { firstname, email, phonenumber, enquiry, company, message } = req.body;
        if ( !firstname || !email || !phonenumber || !enquiry || !message) 
        {
            return res.status(400).json({ success: false, message:'First name, email, phone number, enquiry and message are required'});
        }
       
        // Email validation
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) 
        {
            return res.status(400).json({ success: false, message:'Please provide a valid email address'});
        }
        
        //Save to database
        const contact = await contactRepository.createContact({ firstname:firstname.trim(), email: email.trim().toLowerCase(), phonenumber: phonenumber.trim(), enquiry: enquiry.trim(), company: company ? company.trim() : null, message: message.trim()});
        
        //Send Admin Email
        
        let emailSent = false;
        try {

            await sendContactEnquiryEmail({ firstname, email, phonenumber, enquiry, company, message});
            emailSent = true;
        } catch (emailError) {
            console.error('Admin email failed:',emailError);
        }
        
        // Customer Confirmation

        try 
        {
            await sendCustomerConfirmationEmail({ firstname, email, enquiry});
        } 
        catch (confirmationError) 
        {
            console.error('Customer confirmation email failed:',confirmationError);
        }
        //Response
        return res.status(201).json({  success: true,  emailSent,  message:'Thank you for contacting PursuitEdge. Your enquiry has been submitted successfully.',  contact});
    } catch (error) {
        console.error( 'Create contact error:', error);
        return res.status(500).json({ success: false, message:'Unable to submit your enquiry. Please try again later.'});
    }

};

//Get All Contacts

const getContacts = async (req, res) => {
    try {
        const contacts = await contactRepository.getContacts();
        return res.status(200).json({ success: true, message:'Contact enquiries fetched successfully', contacts});
    } catch (error) {
        console.error( 'Get contacts error:', error);
        return res.status(500).json({ success: false, message: error.message});
    }
};

// Get Single Contact

const getContactById = async (req, res) => {
    try 
    {
        const { id } = req.params;

        if (!id) 
        {
            return res.status(400).json({ success: false, message:'Contact ID is required' });
        }
        const contact = await contactRepository.getContactById(id);
        if (!contact) 
        {
            return res.status(404).json({ success: false, message:'Contact enquiry not found'});
        }
        return res.status(200).json({ success: true, contact });

    } catch (error) {
        console.error('Get contact error:',error);
        return res.status(500).json({ success: false, message: error.message});
    }
};



// Update Status

const updateContactStatus = async (req, res) => {

    try 
    {
        const { id } = req.params;
        const { status } = req.body;
        const allowedStatuses = [ 'NEW', 'CONTACTED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
        if (!id) 
        {
            return res.status(400).json({  success: false,  message:'Contact ID is required'});
        }
        if ( !status || !allowedStatuses.includes(status)) 
        {
            return res.status(400).json({  success: false,  message:'Invalid contact status'});
        }
        const contact = await contactRepository.updateContactStatus( id, status );
        return res.status(200).json({ success: true, message: 'Contact status updated successfully', contact });
    } 
    catch (error) 
    {
        console.error('Update contact status error:',error);
        if ( error.message === 'Contact enquiry not found') 
        {
            return res.status(404).json({  success: false,  message: error.message });
        }
        return res.status(500).json({ success: false, message: error.message});
    }
};

// Delete Contact

const deleteContact = async (req, res) => {
    try 
    {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({  success: false,  message: 'Contact ID is required' });
        }
        await contactRepository.deleteContact(id);
        return res.status(200).json({  success: true,  message: 'Contact enquiry deleted successfully' });
    } catch (error) {
        console.error( 'Delete contact error:', error);
        if (error.message === 'Contact enquiry not found') 
        {
            return res.status(404).json({  success: false,  message: error.message});
        }
        return res.status(500).json({  success: false,  message: error.message});
    }
};


module.exports = {
    createContact,
    getContacts,
    getContactById,
    updateContactStatus,
    deleteContact
};