const db = require("../../models");

const StudentLogin = db.StudentLogin;


// Find student by email
const findStudentByEmail = async (email) => {
    try 
    {
        const student = await StudentLogin.findOne({where: { email: email.toLowerCase()}});
        return student;
    } 
    catch (error) 
    {
        console.error("Error finding student by email:", error);
        throw error;
    }
};

// Find student by provider + providerId
const findStudentByProvider = async ( provider, providerId) => {
    try 
    {
        const student = await StudentLogin.findOne({ where: { provider, providerId}});
        return student;
    } 
    catch (error) {
        console.error( "Error finding student by provider:", error);
        throw error;
    }
};


// Create student
const createStudent = async ( name, email, password, designation) => {
    try 
    {
        const newStudent = await StudentLogin.create({ name, email: email.toLowerCase(), password, designation, provider: "local", status: 1});
        return newStudent;
    } 
    catch (error) 
    {
        console.error("Error creating student:", error);
        throw error;
    }
};

// Find student by ID
const findStudentById = async (id) => {
    try 
    {
        const student = await StudentLogin.findByPk(id);
        return student;

    } catch (error) 
    {
        console.error("Error finding student by ID:", error);
        throw error;
    }
};

module.exports = {
    findStudentByEmail,
    createStudent,
    findStudentById
};
