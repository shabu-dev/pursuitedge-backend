const courseRepository = require("../../repository/Course/courseRepository");

const createCourse = async (req, res) => {
    try {
        const { slug,title,name } = req.body;
        if(!slug || !title || !name) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newCourse = await courseRepository.createCourse(req.body);
        res.status(201).json({ message: "Course created successfully", course: newCourse });
    } catch (error) {
       // console.error("Create course error:", error);

       // Duplicate / unique constraint
       if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({
                success: false,
                message: "Course already exists",
                errors: error.errors.map((item) => ({
                    field: item.path,
                    message: `${item.path} already exists`,
                    value: item.value,
                })),
            });
        }

        // Sequelize validation
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.errors.map((item) => ({
                    field: item.path,
                    message: item.message,
                    value: item.value,
                })),
            });
        }

        res.status(500).json({success: false,message: "Internal server error", error: error.message });
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
        const updatedCourse = await courseRepository.updateCourse(id, req.body);
        res.status(200).json({ message: "Course updated successfully", course: updatedCourse });
    } catch (error) {
        console.error(error);
        if (error.message === "Course not found") {
            return res.status(404).json({
                message: error.message,
            });
        }
        res.status(500).json({ message: error.message });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        await courseRepository.deleteCourse(id);
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
        console.error(error);
        if (error.message === "Course not found") {
            return res.status(404).json({
                message: error.message,
            });
        }
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