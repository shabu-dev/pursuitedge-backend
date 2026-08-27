const db = require('../../models');
const Corporate = db.Corporate;

const createCorporate = async (data) => await Corporate.create(data);

const getCorporates = async () => await Corporate.findAll({ order: [['createdAt', 'DESC']] });

const getCorporateById = async (id) => await Corporate.findByPk(id);

module.exports = { createCorporate, getCorporates, getCorporateById };