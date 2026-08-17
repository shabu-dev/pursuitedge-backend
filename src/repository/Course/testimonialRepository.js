const { where } = require('sequelize');
const db = require('../../models');
const Testimonial = db.Testimonial;


const create = async (data) => {
    return await Testimonial.create(data);
};

const get = async() => {
    return await Testimonial.findAll({
        order: [['name', 'ASC']],
    });
};

const getById = async (id) => {
    return await Testimonial.findByPk(id);
};

const update = async (id, data) => {
    const testimonial = await Testimonial.findByPk(id);

    if (!testimonial) {
        throw new Error('Testimonial not found');
    }

    await Testimonial.update(data);

    return testimonial;
};

const deleteTestimonial = async (id) => {
    const testimonial = await Testimonial.findByPk(id);

    if (!testimonial) {
        throw new Error('Testimonial not found');
    }

    await Testimonial.destroy();

    return testimonial;
};

const getByCountryAndCourse = async({country,course}) => {

    return await Testimonial.findAll({
        where:{ country, course },
        order: [['name', 'ASC']],
    });
}

module.exports = {
    create,
    get,
    getById,
    update,
    deleteTestimonial,
    getByCountryAndCourse
}