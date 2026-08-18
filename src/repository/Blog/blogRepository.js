const db = require("../../models");

const Blog = db.Blog;


// Create blog
const createBlog = async (data) => {
    return await Blog.create(data);
};


// Get all blogs
const getAllBlogs = async () => {
    return await Blog.findAll({
        order: [["createdAt", "DESC"]]
    });
};


// Get active + published blogs
const getPublishedBlogs = async () => {
    return await Blog.findAll({
        where: {
            is_published: true,
            status: true
        },
        order: [["published_at", "DESC"]]
    });
};


// Get blog by ID
const getBlogById = async (id) => {
    return await Blog.findByPk(id);
};


// Get blog by slug
const getBlogBySlug = async (slug) => {
    return await Blog.findOne({
        where: {
            slug
        }
    });
};


// Check slug
const checkSlug = async (slug, excludeId = null) => {
    const where = {
        slug
    };

    if (excludeId) {
        where.id = {
            [db.Sequelize.Op.ne]: excludeId
        };
    }

    return await Blog.findOne({
        where
    });
};


// Update blog
const updateBlog = async (id, data) => {
    const blog = await Blog.findByPk(id);

    if (!blog) {
        throw new Error("Blog not found");
    }

    await blog.update(data);

    return blog;
};


// Soft delete
const deleteBlog = async (id) => {
    const blog = await Blog.findByPk(id);

    if (!blog) {
        throw new Error("Blog not found");
    }

    await blog.update({
        status: false
    });

    return blog;
};


// Update reading time
const updateReadTime = async (id, read_time_minutes) => {
    const blog = await Blog.findByPk(id);

    if (!blog) {
        throw new Error("Blog not found");
    }

    await blog.update({
        read_time_minutes
    });

    return blog;
};


module.exports = {
    createBlog,
    getAllBlogs,
    getPublishedBlogs,
    getBlogById,
    getBlogBySlug,
    checkSlug,
    updateBlog,
    deleteBlog,
    updateReadTime
};