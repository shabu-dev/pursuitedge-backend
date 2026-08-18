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
};

const getCountry = async(req,res)=>{
    try
    {
        const getCountry = await countryRepository.getCountry();
        res.status(200).json({success:true,message:"Fetch the country Data", getCountry});
    }
    catch(error)
    {
        res.status(500).json({success:false, message:error.message})
    }
};

const updateCountry = async(req,res)=>{
    try
    {
        const {id} = req.params;
        if(!id)
        {
            return res.status(400).json({success:false, message : "Invalid request"});
        }
        const {country_name,country_code,currency} = req.body;
        if(!country_name || !country_code)
        {
           return res.status(400).json({success:false, message : "Country name and code are required!"});
        }
        const updateCountry = await countryRepository.updateCountry(id,{country_name, country_code, currency})
        res.status(200).json({success:true, message : "Country Updated Sucessfully", updateCountry});
    }
    catch(error)
    {
        res.status(500).json({success:false, message:error.message})
    }
}

const deleteCountry = async(req,res)=>{
    try
    {
        const { id } = req.params;
        await countryRepository.deleteCountry(id);
        return res.status(200).json({ message: 'Country deleted successfully' });

    }
    catch(error)
    {
        if (error.message === 'Country not found') {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createCountry,
    getCountry,
    updateCountry,
    deleteCountry,
}