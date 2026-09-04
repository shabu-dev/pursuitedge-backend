const db = require('../../models');

const Course = db.Course;
const CourseContent = db.CourseContent;
const sequelize = db.sequelize;

const createCourse = async (courseData) => {
    const transaction = await db.sequelize.transaction();
    try {
       const {content, ...courseDataWithoutContent} = courseData;
       const course = await Course.create( courseDataWithoutContent, {transaction});
       if(content)
        {
            await CourseContent.create(
            {
                id: content.id || `${course.id}-content`,
                course_id: course.id,
                why_earn: content.why_earn,
                exam_domains: content.exam_domains,
                training_agenda: content.training_agenda,
                exam_glance: content.exam_glance,
                eligibility: content.eligibility,
                target_audience: content.target_audience,
                learning_modes: content.learning_modes,
                pass_guarantee: content.pass_guarantee,
                inclusions: content.inclusions,
                achievements: content.achievements,
                outcomes: content.outcomes,
                bottom_cta: content.bottom_cta,
            }, {transaction}
            );
        }
        await transaction.commit();
        return await Course.findByPk(course.id, {
            include: [
                {
                    model: CourseContent,
                    as: 'content',
                },
            ],
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Error creating course:", error);
        throw error;
    }
};

const getCourses = async () => {
    try {
        const courses = await Course.findAll({
            where: { status: 'Active',},
            include: [
                {
                    model: CourseContent,
                    as: 'content',
                },
            ],
           
            order: [['order', 'ASC']],
        });
        return courses;
    } catch (error) {
        console.error("Error fetching courses:", error);
        throw error;
    }
};

const getCourseById = async (id) => {
    try {
        const course = await Course.findByPk(id,{
            include: [
                {
                    model: CourseContent,
                    as: 'content',
                },
            ],
        });
        return course;
    } catch (error) {
        console.error("Error fetching course by ID:", error);
        throw error;
    }
};

const updateCourse = async (id, courseData) => {
    const transaction = await db.sequelize.transaction();
    try 
    {
        const course = await Course.findByPk(id,{
            include: [
                {
                    model: CourseContent,
                    as: 'content',
                },
            ],
            transaction,
        });   
        if (!course) {
            throw new Error("Course not found");
        }
        const {content,...courseDataWithoutContent} = courseData;
        await course.update(courseDataWithoutContent,{ transaction });  
        if (content) {
            if (course.content) {
                await course.content.update(content,{ transaction });
            }
            else
            {
                await CourseContent.create({ id: content.id || `${id}-content`, course_id: id, ...content, }, { transaction });
            }
        } 
        await transaction.commit();
        return await Course.findByPk(id, {
            include: [
                {
                    model: CourseContent,
                    as: 'content',
                },
            ],
        });
    } catch (error) {
        await transaction.rollback();
        console.error("Error updating course:", error);
        throw error;
    }
};

const deleteCourse = async (id) => {
    try {
        const course = await Course.findByPk(id);
        if (!course) {
            throw new Error("Course not found");
        }
        await course.destroy();
    } catch (error) {
        console.error("Error deleting course:", error);
        throw error;
    }
};

const getCourseBySlug = async (slug) => {
    try {
        const course = await Course.findOne({ where: { slug },
            include: [
                {
                    model: CourseContent,
                    as: 'content',
                },
            ], 
        });
        return course;
    } catch (error) {
        console.error("Error fetching course by slug:", error);
        throw error;
    }
};

const updateCourseHeroImage = async (id, heroImage) => { 
    const [updated] = await Course.update({ hero_image: heroImage }, { where: { id } }); 
    return updated ? await Course.findOne({ where: { id } }) : null; 
};

const searchCourses = async (search) => {
    return await Course.findAll({ attributes: ['id', 'name', 'slug', 'category', 'hero_image'], where: { status: 'Active', [db.Sequelize.Op.or]: [{ name: { [db.Sequelize.Op.like]: `%${search}%` } }, { category: { [db.Sequelize.Op.like]: `%${search}%` } }, { slug: { [db.Sequelize.Op.like]: `%${search}%` } }] },  order: [['name', 'ASC']], limit: 8 });
};

const getPopularCourses = async () => {
    return await Course.findAll({ attributes: ['id', 'slug', 'name', 'category', 'overview', 'title', 'hero_image', 'badge_text'],  where: { status: 'Active'},order: [['id', 'ASC']] });
};

const getCategoryWiseCourses = async (slug) => {
    const category = await db.Category.findOne({
        where: { slug: slug }
    });
    if (!category) {
        return [];
    }
    const courses = await db.Course.findAll({ 
        attributes: ['id', 'title', 'name', 'slug', 'category', 'hero_image', 'hero_subtitle', 'duration','badge_text','level'],
        where: { category: category.name,status: 'Active' },
        order: [["order", "ASC"]]
    })

    return courses;

}

const getCategoryWiseCount = async () => {
    try {
        const categories = await db.Category.findAll({
            attributes: [ 'name', 'slug', 'description', 'status'],
            where: { status: 'Active' },
            order: [['order', 'ASC']],
            raw: true
        });

        const categoryWiseCount = await Promise.all(
            categories.map(async (category) => {
                const course_count = await Course.count({
                    where: { category: category.name, status: 'Active'}
                });
                return { name: category.name, course_count, slug: category.slug, description: category.description, status: category.status};
            })
        );
        return categoryWiseCount;

    } catch (error) {
        console.error( 'Error fetching category wise course count:', error);
        throw error;
    }
};


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
