const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginRepository = require("../../repository/Login/loginRepository");
const studentLoginRepository = require("../../repository/Login/studentLoginRepository");

const { OAuth2Client } = require("google-auth-library");

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


// Student Register
const studentRegister = async (req, res) => {
    try 
    {
        const { name, email, password, designation } = req.body;

        // Validate required fields
        if (!name || !email || !password) 
        {
            return res.status(400).json({ success: false, message: "Name, email and password are required"});
        }

        // Check if student already exists
        const existingStudent = await studentLoginRepository.findStudentByEmail(email);

        if (existingStudent) 
        {
            return res.status(409).json({ success: false, message: "Student already exists with this email"});
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create student
        const student = await studentLoginRepository.createStudent( name, email, hashedPassword, designation);

        // Convert Sequelize object to normal object
        const studentData = student.toJSON();

        // Never send password to frontend
        delete studentData.password;

        return res.status(201).json({ success: true, message: "Student registered successfully", student: studentData });

    } 
    catch (error) 
    {
        console.error("Error registering student:", error);
        return res.status(500).json({ success: false, message: "Error registering student"});
    }
};




// Student Login
const studentLogin = async (req, res) => {
    try 
    {
        const { email, password } = req.body;

        // Validate
        if (!email || !password) 
        {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        // Find student
        const student = await studentLoginRepository.findStudentByEmail(email);

        if (!student) 
        {
            return res.status(404).json({ success: false, message: "Student not found" });
        }

        // Check student status
        if (student.status !== 1) {
            return res.status(403).json({ success: false, message: "Student account is inactive"});
        }

        // Check password
        const isMatch = await bcrypt.compare( password, student.password );

        if (!isMatch) 
        {
            return res.status(401).json({ success: false, message: "Invalid email or password"});
        }

        // Generate JWT
        const token = jwt.sign( { id: student.id, email: student.email, role: "student"},process.env.JWT_SECRET,{expiresIn: "1h"});

        // Student response
        const studentData = student.toJSON();
        delete studentData.password;

        return res.status(200).json({ success: true, message: "Student login successful", token, student: studentData });
    }
    catch (error) {
        console.error( "Error logging in student:", error);
        return res.status(500).json({ success: false, message: "Error logging in student"});
    }
};

const studentGoogleLogin = async (req, res) => {
    try {
        const { credential, designation } = req.body;

        // Check Google credential
        if (!credential) 
        {
            return res.status(400).json({ success: false, message: "Google credential is required"});
        }

        // Verify Google ID token
        const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID});

        // Get Google user information
        const payload = ticket.getPayload();

        const googleId = payload.sub;
        const email = payload.email;
        const name = payload.name;

        if (!googleId || !email) 
        {
            return res.status(400).json({ success: false, message: "Invalid Google account information"});
        }

        // ---------------------------------------
        // Check student by Google ID
        // ---------------------------------------
        let student = await studentLoginRepository.findStudentByProvider( "google", googleId );

        // Existing Google student
        if (student) 
        {
            // Check status
            if (student.status !== 1) 
            {
                return res.status(403).json({ success: false, message: "Student account is inactive"});
            }

            // Generate JWT
            const token = jwt.sign({ id: student.id, email: student.email, role: "student"}, process.env.JWT_SECRET, { expiresIn: "1h"});

            const studentData = student.toJSON();
            delete studentData.password;

            return res.status(200).json({ success: true, message: "Google student login successful", token, student: studentData});
        }

        // ---------------------------------------
        // Check email
        // ---------------------------------------

        student = await studentLoginRepository.findStudentByEmail( email );

        if (student) 
        {
            return res.status(409).json({ success: false, message:     "This email is already registered. Please use your existing login method."});
        }

        // ---------------------------------------
        // Create new Google student
        // ---------------------------------------

        student = await studentLoginRepository.createStudent( name, email, null, designation || null, "google", googleId);

        // Generate JWT
        const token = jwt.sign({id: student.id,email: student.email,role: "student"}, process.env.JWT_SECRET, {expiresIn: "1h"});

        const studentData = student.toJSON();
        delete studentData.password;

        return res.status(201).json({ success: true, message: "Google student signup successful", token, student: studentData});
    } 
    catch (error) {
        console.error( "Google student login error:", error);
        return res.status(500).json({ success: false, message: "Google authentication failed"});
    }
};


const studentLinkedinLogin = async (req, res) => {
    try {
        const { code, designation } = req.body;

        if (!code) 
        {
            return res.status(400).json({ success: false, message: "LinkedIn authorization code is required"});
        }

        // ---------------------------------------
        // 1. Exchange authorization code
        // ---------------------------------------

        const tokenResponse = await axios.post( "https://www.linkedin.com/oauth/v2/accessToken",
            new URLSearchParams({
                grant_type: "authorization_code",
                code: code,
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET,
                redirect_uri:process.env.LINKEDIN_REDIRECT_URI
            }),
            {
                headers: { "Content-Type":"application/x-www-form-urlencoded"}
            }
        );

        const accessToken = tokenResponse.data.access_token;

        if (!accessToken) 
        {
            return res.status(400).json({ success: false, message:"Unable to get LinkedIn access token"});
        }

        // ---------------------------------------
        // 2. Get LinkedIn user information
        // ---------------------------------------

        const userResponse = await axios.get( "https://api.linkedin.com/v2/userinfo", { headers: { Authorization: `Bearer ${accessToken}`} } );
        const linkedinUser = userResponse.data;
        const linkedinId = linkedinUser.sub;
        const email = linkedinUser.email;
        const name = linkedinUser.name;

        if (!linkedinId || !email) 
        {
            return res.status(400).json({ success: false, message:     "Unable to get LinkedIn user information"});
        }


        // ---------------------------------------
        // 3. Find existing LinkedIn student
        // ---------------------------------------

        let student = await studentLoginRepository.findStudentByProvider( "linkedin", linkedinId );

        // Existing student
        if (student) {
            if (student.status !== 1) 
            {
                return res.status(403).json({ success: false, message:     "Student account is inactive" });
            }
            const token = jwt.sign( {id: student.id,email: student.email,role: "student"}, process.env.JWT_SECRET,{ expiresIn: "1h"});

            const studentData = student.toJSON();
            delete studentData.password;
            return res.status(200).json({ success: true, message:"LinkedIn student login successful", token, student: studentData});
        }

        // ---------------------------------------
        // 4. Check email
        // ---------------------------------------
        student = await studentLoginRepository.findStudentByEmail(email);

        if (student) 
        {
            return res.status(409).json({ success: false, message:"This email is already registered. Please use your existing login method." });
        }

        // ---------------------------------------
        // 5. Create LinkedIn student
        // ---------------------------------------

        student = await studentLoginRepository.createStudent( name, email, null, designation || null, "linkedin", linkedinId);

        // ---------------------------------------
        // 6. Generate JWT
        // ---------------------------------------

        const token = jwt.sign({id: student.id,email: student.email,role: "student"},process.env.JWT_SECRET,{expiresIn: "1h"});

        const studentData = student.toJSON();
        delete studentData.password;

        return res.status(201).json({success: true,message:"LinkedIn student signup successful",token,student: studentData});

    } 
    catch (error) 
    {
        console.error( "LinkedIn student login error:", error.response?.data || error );
        return res.status(500).json({ success: false, message: "LinkedIn authentication failed"});
    }
};


// get student profile
const getStudentProfile = async (req, res) => {
  try {
    const student = await studentLoginRepository.findStudentById(req.student.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    const { password, ...safeUser } = student.toJSON ? student.toJSON() : student;
    return res.status(200).json({ message: "Student profile", user: safeUser });
  } catch (error) {
    console.error("Student profile error:", error);
    return res.status(500).json({ message: "Error fetching student profile" });
  }
};


module.exports = {
    register,
    login,
    studentRegister,
    studentLogin,
    studentGoogleLogin,
    studentLinkedinLogin,
    getStudentProfile
};