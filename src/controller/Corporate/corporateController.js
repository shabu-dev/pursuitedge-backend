const corporateRepository = require('../../repository/Corporate/corporateRepository');
const { sendCorporateEnquiryEmail, sendCorporateConfirmationEmail } = require('../../service/Email/corporateService');

const createCorporate = async (req, res) => {
    try {
        const { name, email, company, team_size, courses_interested, training_mode, additional_details } = req.body;
        if (!name || !email || !company || !team_size || !courses_interested || !training_mode) return res.status(400).json({ success: false, message: 'Name, email, company, team size, courses interested and training mode are required' });
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
        const corporate = await corporateRepository.createCorporate({ name: name.trim(), email: email.trim().toLowerCase(), company: company.trim(), team_size: team_size.trim(), courses_interested: courses_interested.trim(), training_mode: training_mode.trim(), additional_details: additional_details ? additional_details.trim() : null });
        let emailSent = false;
        try { await sendCorporateEnquiryEmail({ name, email, company, team_size, courses_interested, training_mode, additional_details }); emailSent = true; } catch (emailError) { console.error('Corporate admin email failed:', emailError); }
        try { await sendCorporateConfirmationEmail({ name, email, company, courses_interested, training_mode }); } catch (confirmationError) { console.error('Corporate confirmation email failed:', confirmationError); }
        return res.status(201).json({ success: true, emailSent, message: 'Thank you for contacting Pursuit Edge. Your corporate training enquiry has been submitted successfully.', corporate });
    } catch (error) {
        console.error('Create corporate enquiry error:', error);
        return res.status(500).json({ success: false, message: 'Unable to submit your corporate enquiry. Please try again later.' });
    }
};

const getCorporates = async (req, res) => {
    try { const corporates = await corporateRepository.getCorporates(); return res.status(200).json({ success: true, message: 'Corporate enquiries fetched successfully', corporates }); } catch (error) { console.error('Get corporate enquiries error:', error); return res.status(500).json({ success: false, message: error.message }); }
};

const getCorporateById = async (req, res) => {
    try { const { id } = req.params; if (!id) return res.status(400).json({ success: false, message: 'Corporate enquiry ID is required' }); const corporate = await corporateRepository.getCorporateById(id); if (!corporate) return res.status(404).json({ success: false, message: 'Corporate enquiry not found' }); return res.status(200).json({ success: true, corporate }); } catch (error) { console.error('Get corporate enquiry error:', error); return res.status(500).json({ success: false, message: error.message }); }
};

module.exports = { createCorporate, getCorporates, getCorporateById };