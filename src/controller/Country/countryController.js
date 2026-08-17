const countryRepository = require('../../repository/Country/countryRepository');

const createCountry = async(req,res) => {
    
    try
    {
        const {country_name,country_code,currency} = req.body;
        if(!country_name || !country_code)
        {
           return res.status(400).json({success:false, message : "Country name and code are required!"});
        }
        const existing =await countryRepository.checkDuplicate({country_name,country_code});
        if(existing.length > 0)
        {
            res.status(200).json({status:failur,message:"Record already exists"});
        }
        const createCountry = await countryRepository.createCountry({country_name,country_code,currency})
        res.status(201).json({success:true, message : "Country Created Sucessfully", createCountry});
    }
    catch(error)
    {
        res.status(500).json({success:false, message:error.message})
    }
}

module.exports = {
    createCountry,
}