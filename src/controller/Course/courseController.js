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

const updateCourseHeroImage = async (req, res) => {
    try {
        const { course } = req.body;
        if (!course) return res.status(400).json({ success: false, message: 'Course is required' });
        if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const heroImage = `${baseUrl}/uploads/course/${req.file.filename}`;

        const updatedCourse = await courseRepository.updateCourseHeroImage(course.trim(), heroImage);

        if (!updatedCourse) return res.status(404).json({ success: false, message: 'Course not found' });

        return res.status(200).json({ success: true, message: 'Course hero image updated successfully', course: updatedCourse });
    } catch (error) {
        console.error('Update course hero image error:', error);
        return res.status(500).json({ success: false, message: 'Unable to update course hero image' });
    }
};

const searchCourses = async (req, res) => {
    try {
        const { search } = req.query;
        if (!search || !search.trim()) return res.status(400).json({ success: false, message: 'Search keyword is required' });
        const courses = await courseRepository.searchCourses(search.trim());
        return res.status(200).json({ success: true, courses });
    } catch (error) {
        console.error('Search courses error:', error);
        return res.status(500).json({ success: false, message: 'Unable to search courses' });
    }
};

const getPopularCourses = async (req, res) => {
    try {
        const courses = await courseRepository.getPopularCourses();
        return res.status(200).json({ success: true, message: 'Popular courses fetched successfully', courses });
    } catch (error) {
        console.error('Get popular courses error:', error);
        return res.status(500).json({ success: false, message: 'Unable to fetch popular courses' });
    }
};


const getCategoryWiseCourses = async (req,res) => {
    try
    {
        const { slug } = req.params;
        const course = await courseRepository.getCategoryWiseCourses(slug);
         if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ message: "Course fetched successfully", course });
    }
    catch(error)
    {
        res.status(500).json({ message: error.message });
    }
}

const getCategoryWiseCount =async(req,res) => {
    try 
    {
        const categories = await courseRepository.getCategoryWiseCount();
        return res.status(200).json({ success: true, message: 'Category wise course count fetched successfully', categories});
    }
    catch (error) {
        console.error( 'Get category wise count error:', error);
        return res.status(500).json({ success: false, message: 'Unable to fetch category wise course count'
        });
    }
}



module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getCourseBySlug,
    updateCourseHeroImage,
    searchCourses,
    getPopularCourses,
    getCategoryWiseCourses,
    getCategoryWiseCount
};       