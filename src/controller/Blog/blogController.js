const blogRepository = require("../../repository/Blog/blogRepository");


// Generate slug
const generateSlug = (title) => {
    return title .toString() .toLowerCase() .trim() .replace(/[^\w\s-]/g, "") .replace(/\s+/g, "-") .replace(/-+/g, "-");
};


// Make unique slug
const generateUniqueSlug = async (title, excludeId = null) => {
    const baseSlug = generateSlug(title);

    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const existing = await blogRepository.checkSlug(
            slug,
            excludeId
        );

        if (!existing) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;
        counter++;
    }
};


// Parse tags
const parseTags = (tags) => {
    if (!tags) {
        return null;
    }

    if (Array.isArray(tags)) {
        return tags;
    }

    try {
        const parsed = JSON.parse(tags);

        if (!Array.isArray(parsed)) {
            throw new Error("Tags must be a JSON array");
        }

        return parsed;
    } catch (error) {
        throw new Error(
            'Tags must be a valid JSON array. Example: ["nodejs","react"]'
        );
    }
};


// CREATE BLOG
const createBlog = async (req, res) => {
    try {
        const {
            title,
            excerpt,
            content,
            category,
            tags,
            author,
            read_time_minutes,
            is_published,
            meta_title,
            meta_description,
            status
        } = req.body;


        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required!"
            });
        }


        const slug = await generateUniqueSlug(title);

        const parsedTags = parseTags(tags);


        const published =
            is_published === true ||
            is_published === "true" ||
            is_published === 1 ||
            is_published === "1";


        const active =
            status === undefined ||
            status === true ||
            status === "true" ||
            status === 1 ||
            status === "1";


        const published_at = published
            ? new Date()
            : null;


        const cover_image_url = req.file
            ? `/uploads/blog/${req.file.filename}`
            : null;


        const blog = await blogRepository.createBlog({
            title,
            slug,
            excerpt,
            content,
            cover_image_url,
            category,
            tags: parsedTags,
            author,
            read_time_minutes: read_time_minutes || 0,
            is_published: published,
            meta_title,
            meta_description,
            published_at,
            status: active
        });


        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog
        });

    } catch (error) {
        console.error("Create blog error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET PUBLISHED BLOGS
const getBlogs = async (req, res) => {
    try {
        const blogs = await blogRepository.getPublishedBlogs();

        return res.status(200).json({
            success: true,
            blogs
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET EVERYTHING
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await blogRepository.getAllBlogs();

        return res.status(200).json({
            success: true,
            blogs
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET BLOG BY ID
const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required"
            });
        }


        const blog = await blogRepository.getBlogById(id);


        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }


        return res.status(200).json({
            success: true,
            blog
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET BLOG BY SLUG
const getBlogBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Slug is required"
            });
        }


        const blog = await blogRepository.getBlogBySlug(slug);


        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }


        return res.status(200).json({
            success: true,
            blog
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE BLOG
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required"
            });
        }


        const existingBlog = await blogRepository.getBlogById(id);


        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }


        const {
            title,
            excerpt,
            content,
            category,
            tags,
            author,
            read_time_minutes,
            is_published,
            meta_title,
            meta_description,
            status
        } = req.body;


        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required!"
            });
        }


        // Generate new slug if title changed
        let slug = existingBlog.slug;

        if (title !== existingBlog.title) {
            slug = await generateUniqueSlug(title, id);
        }


        const data = {
            title,
            slug,
            excerpt,
            content,
            category,
            author,
            read_time_minutes:
                read_time_minutes !== undefined
                    ? read_time_minutes
                    : existingBlog.read_time_minutes,
            meta_title,
            meta_description
        };


        // Tags only if supplied
        if (tags !== undefined) {
            data.tags = parseTags(tags);
        }


        // Status
        if (status !== undefined) {
            data.status =
                status === true ||
                status === "true" ||
                status === 1 ||
                status === "1";
        }


        // Publishing
        if (is_published !== undefined) {

            const published =
                is_published === true ||
                is_published === "true" ||
                is_published === 1 ||
                is_published === "1";


            data.is_published = published;


            if (published && !existingBlog.is_published) {
                data.published_at = new Date();
            }


            if (!published) {
                data.published_at = null;
            }
        }


        // New image
        if (req.file) {
            data.cover_image_url =
                `/uploads/blog/${req.file.filename}`;
        }


        const blog = await blogRepository.updateBlog(id, data);


        return res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog
        });

    } catch (error) {
        console.error("Update blog error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE BLOG - SOFT DELETE
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required"
            });
        }


        const blog = await blogRepository.deleteBlog(id);


        return res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
            blog
        });

    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE READ TIME
const updateReadTime = async (req, res) => {
    try {
        const { id } = req.params;

        const { read_time_minutes } = req.body;


        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required"
            });
        }


        if (
            read_time_minutes === undefined ||
            read_time_minutes === null ||
            isNaN(read_time_minutes) ||
            Number(read_time_minutes) < 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid read_time_minutes is required"
            });
        }


        const blog = await blogRepository.updateReadTime(
            id,
            Number(read_time_minutes)
        );


        return res.status(200).json({
            success: true,
            message: "Read time updated successfully",
            blog
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createBlog,
    getBlogs,
    getAllBlogs,
    getBlogById,
    getBlogBySlug,
    updateBlog,
    deleteBlog,
    updateReadTime
};