const db = require('../../models');

const Country = db.Country;


const checkDuplicate = async({country_name,country_code}) =>
{
    return await Country.findAll(
        {
            where:{country_name,country_code}
        }
    )
};

const createCountry = async(data)=>{
    return await Country.create(data);
};

const getCountry = async()=>{
    return await Country.findAll();
}

const updateCountry = async(id,countryData)=>{
    try {
        const country = await Country.findByPk(id);
        if (!country) {
            throw new Error('Country not found');
        }
        await country.update(countryData);
        return country;
    } catch (error) {
        console.error('Error updating country:', error);
        throw error;
    }
}

const deleteCountry = async(id)=>{
    try {
        const country = await Country.findByPk(id);
        if (!country) {
            throw new Error('Country not found');
        }
        await country.destroy(id);
        return country;
    } catch (error) {
        console.error('Error deleting country:', error);
        throw error;
    }
}

module.exports = {
    checkDuplicate,
    createCountry,
    getCountry,
    updateCountry,
    deleteCountry
}