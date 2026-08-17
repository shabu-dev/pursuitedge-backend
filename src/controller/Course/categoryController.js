const categoryRepository = require('../../repository/Course/categoryRepository');

const createCategory = async (req, res) => {
    try {
        const { name, slug } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ message: 'Name and slug are required' });
        }
        const category = await categoryRepository.createCategory(req.body);
        return res.status(201).json({
            message: 'Category created successfully',
            category,
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                success: false,
                message: 'Category already exists',
                errors: error.errors.map((item) => ({
                    field: item.path,
                    message: `${item.path} already exists`,
                    value: item.value,
                })),
            });
        }

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors.map((item) => ({
                    field: item.path,
                    message: item.message,
                    value: item.value,
                })),
            });
        }

        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await categoryRepository.getCategories();
        return res.status(200).json({ message: 'Categories fetched successfully', categories });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryRepository.getCategoryById(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({ message: 'Category fetched successfully', category });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getCategoryBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await categoryRepository.getCategoryBySlug(slug);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({ message: 'Category fetched successfully', category });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryRepository.updateCategory(id, req.body);

        return res.status(200).json({ message: 'Category updated successfully', category });
    } catch (error) {
        if (error.message === 'Category not found') {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        await categoryRepository.deleteCategory(id);

        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        if (error.message === 'Category not found') {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    getCategoryBySlug,
    updateCategory,
    deleteCategory,
};
