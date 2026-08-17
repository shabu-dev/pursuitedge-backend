const db = require('../../models');

const Category = db.Category;

const createCategory = async (categoryData) => {
    try {
        const category = await Category.create(categoryData);
        return category;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
};

const getCategories = async () => {
    try {
        return await Category.findAll({
            order: [['createdAt', 'DESC']],
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

const getCategoryById = async (id) => {
    try {
        return await Category.findByPk(id);
    } catch (error) {
        console.error('Error fetching category by id:', error);
        throw error;
    }
};

const getCategoryBySlug = async (slug) => {
    try {
        return await Category.findOne({ where: { slug } });
    } catch (error) {
        console.error('Error fetching category by slug:', error);
        throw error;
    }
};

const updateCategory = async (id, categoryData) => {
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            throw new Error('Category not found');
        }
        await category.update(categoryData);
        return category;
    } catch (error) {
        console.error('Error updating category:', error);
        throw error;
    }
};

const deleteCategory = async (id) => {
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            throw new Error('Category not found');
        }
        await category.destroy();
        return true;
    } catch (error) {
        console.error('Error deleting category:', error);
        throw error;
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
