const instructorRepository = require('../../repository/Course/instructorRepository');
const fs = require('fs');
const path = require('path');

const parseCertifications = (certifications) => {
    if (!certifications) {
        return [];
    }

    if (Array.isArray(certifications)) {
        return certifications;
    }

    try {
        return JSON.parse(certifications);
    } catch (error) {
        throw new Error('certifications must be a valid JSON array');
    }
};

const deleteImageFile = (imageUrl) => {
    if (!imageUrl) {
        return;
    }

    try {
        const filename = path.basename(imageUrl);
        const filePath = path.join(__dirname, '../../uploads/instructors', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error('Image deletion error:', error.message);
    }
};

const createInstructor = async (req, res) => {
    try {
        const {
            name,
            title,
            bio,
            linkedin_url,
            certifications,
            course_taught,
            rating,
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name is required',
            });
        }

        const parsedCertifications = parseCertifications(certifications);

        const image_url = req.file
            ? `/uploads/instructors/${req.file.filename}`
            : null;

        const instructor = await instructorRepository.createInstructor({
            name,
            title,
            bio,
            image_url,
            linkedin_url,
            certifications: parsedCertifications,
            course_taught,
            rating: rating || 0,
        });

        return res.status(201).json({
            success: true,
            message: 'Instructor created successfully',
            instructor,
        });
    } catch (error) {
        if (req.file) {
            deleteImageFile(`/uploads/instructors/${req.file.filename}`);
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
};

const getInstructors = async (req, res) => {
    try {
        const instructors = await instructorRepository.getInstructors();

        return res.status(200).json({
            success: true,
            message: 'Instructors fetched successfully',
            instructors,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getInstructorById = async (req, res) => {
    try {
        const { id } = req.params;

        const instructor = await instructorRepository.getInstructorById(id);

        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: 'Instructor not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Instructor fetched successfully',
            instructor,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateInstructor = async (req, res) => {
    try {
        const { id } = req.params;

        const existingInstructor = await instructorRepository.getInstructorById(id);

        if (!existingInstructor) {
            return res.status(404).json({
                success: false,
                message: 'Instructor not found',
            });
        }

        const {
            name,
            title,
            bio,
            linkedin_url,
            certifications,
            course_taught,
            rating,
        } = req.body;

        const updateData = {
            name,
            title,
            bio,
            linkedin_url,
            course_taught,
            rating,
        };

        if (certifications !== undefined) {
            updateData.certifications = parseCertifications(certifications);
        }

        if (req.file) {
            updateData.image_url = `/uploads/instructors/${req.file.filename}`;
        }

        const instructor = await instructorRepository.updateInstructor(id, updateData);

        if (req.file && existingInstructor.image_url) {
            deleteImageFile(existingInstructor.image_url);
        }

        return res.status(200).json({
            success: true,
            message: 'Instructor updated successfully',
            instructor,
        });
    } catch (error) {
        if (req.file) {
            deleteImageFile(`/uploads/instructors/${req.file.filename}`);
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params;

        const instructor = await instructorRepository.getInstructorById(id);

        if (!instructor) {
            return res.status(404).json({
                success: false,
                message: 'Instructor not found',
            });
        }

        await instructorRepository.deleteInstructor(id);

        if (instructor.image_url) {
            deleteImageFile(instructor.image_url);
        }

        return res.status(200).json({
            success: true,
            message: 'Instructor deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createInstructor,
    getInstructors,
    getInstructorById,
    updateInstructor,
    deleteInstructor,
};