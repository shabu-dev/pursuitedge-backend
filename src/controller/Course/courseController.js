const courseRepository = require("../../repository/Course/courseRepository");

const createCourse = async (req, res) => {
    try {
        const { id,slug,title,name } = req.body;
        if(!id || !slug || !title || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newCourse = await courseRepository.createCourse({ id,slug,title,name });
        res.status(201).json({ message: "Course created successfully", course: newCourse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCourses = async (req, res) => {
    try {
        const courses = await courseRepository.getCourses();
        res.status(200).json({ message: "Courses fetched successfully", courses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await courseRepository.getCourseById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ message: "Course fetched successfully", course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;  
        const { slug, title, name } = req.body;
        const updatedCourse = await courseRepository.updateCourse(id, { slug, title, name });
        res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await courseRepository.deleteCourse(id);
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};   


const getCourseBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const course = await courseRepository.getCourseBySlug(slug);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ message: "Course fetched successfully", course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCourseBySlug
};       