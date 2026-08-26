const testimonialRepository = require("../../repository/Course/testimonialRepository");
const path = require("path");
const fs = require("fs");
const { Testimonial } = require("../../models");



const deleteImageFile = (imageUrl) => {
    if (!imageUrl) {
        return;
    }

    try {
        const filename = path.basename(imageUrl);
        const filePath = path.join(__dirname, '../../uploads/testimonials', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.error('Image deletion error:', error.message);
    }
};


const create = async(req,res) => {

    try{
        const {name,role,company,content,rating,course} = req.body;
        if(!name || !role || !content || !rating)
        {
            res.status(400).json({"sucess": false, "message" : "Name, Role, Content and Rating are required!"});
        }
        const image_url = req.file ? `/uploads/testimonials/${req.file.filename}` : null;

        const testimonial = await testimonialRepository.create({name,role,company,content,rating,course,image_url});
        return res.status(201).json({success: true, message: 'Testimonial created successfully', testimonial,});
    }
    catch(error)
    {
        if (req.file) 
        {
            deleteImageFile(`/uploads/testimonials/${req.file.filename}`);
        }
        return res.status(500).json({ success: false, message: 'Internal server error', error: error.message,});
    }

};

const get = async (req,res) => {

     try {
            const testimonials = await testimonialRepository.get();
            return res.status(200).json({success: true,message: 'Testimonials fetched successfully', testimonials, });
        } catch (error) {
            return res.status(500).json({success: false, message: error.message, });
        }

};

const getById = async(req,res) => {
    try{
        const { id } = req.params;
        const testimonials = await testimonialRepository.getById(id);
        if(!testimonials)
        {
            res.status(404).json({success: false, message: 'Testimonials not found',});
        }
        return res.status(200).json({success: true, message: 'Testimonials fetched successfully', testimonials, });
    }
    catch(error)
    {
        return res.status(500).json({ success: false, message: error.message,});
    }
};

const update = async(req,res) => {
    try{
        const { id } = req.params;
        const existingTestimonial = await testimonialRepository.getById(id);
        if(!existingTestimonial)
        {
           return  res.status(404).json({sucess:false, message : "Testimonial not found"});
        }
        const {name,role,company,content,rating,course} = req.body;
        if(!name || !role || !content || !rating)
        {
          return  res.status(400).json({"sucess": false, "message" : "Name, Role, Content and Rating are required!"});
        }
        const updateData = {name, role, company, content, rating, course,};
        if (req.file) {
            updateData.image_url = '/uploads/testimonials/${req.file.filename}';
        }
        const testimonial = await testimonialRepository.update(id, updateData);
        if (req.file && existingTestimonial.image_url) {
            deleteImageFile(existingTestimonial.image_url);
        }
        return res.status(200).json({ success: true, message: 'Testimonial updated successfully', testimonial,});
    }
    catch(error)
    {
         if (req.file) {
            deleteImageFile(`/uploads/testimonials/${req.file.filename}`);
        }
        return res.status(500).json({ success: false, message: error.message,});
    }
};

const deleteTestimonial = async(req,res) => {
    try{
        const { id } = req.params;
        const existingTestimonial = await testimonialRepository.getById(id);
        if(!existingTestimonial)
        {
           return   res.status(404).json({sucess:false, message : "Testimonial not found"});
        }
        await testimonialRepository.deleteTestimonial(id);
        
        if (existingTestimonial.image_url) {
            deleteImageFile(existingTestimonial.image_url);
        }
        return res.status(200).json({ success: true, message: 'Testimonial deleted successfully',});
    }
    catch(error)
    {
        return res.status(500).json({ success: false, message: error.message, });
    }
};

const getByCountryAndCourse = async(req,res) => {

    try{
        const {country,course} = req.body;
        if(!country || !course)
        {
            res.status(400).json({success:false, message : "Country and course are required!"});
        }
        const getByCountryAndCourse = await testimonialRepository.getByCountryAndCourse({country,course})
        res.status(200).json({success : true,getByCountryAndCourse });
    }
    catch(error)
    {
        res.status(500).json({success: false, message: error.message})
    }
}

module.exports = {
    create,
    get,
    getById,
    update,
    deleteTestimonial,
    getByCountryAndCourse
}