const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginRepository = require("../../repository/Login/loginRepository");

// Register a new user
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if(!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await loginRepository.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const result = await loginRepository.createUser(username, email, password);
        const user = result.toJSON();
        delete user.password; // Remove password from the response
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user" });
    }   
};

// Login an existing user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await loginRepository.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Error logging in" });
    }
};


module.exports = {
    register,
    login
};