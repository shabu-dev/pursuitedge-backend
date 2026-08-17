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
}

module.exports = {
    checkDuplicate,
    createCountry
}