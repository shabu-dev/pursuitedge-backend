const express = require("express");

const router = express.Router();

const loginController = require("../../controller/Login/loginController");
const authenticateStudent = require("../../middleware/authMiddleware");


router.post("/register", loginController.register);
router.post("/login", loginController.login);

// Student Login Routes
router.post("/student/register", loginController.studentRegister);
router.post("/student/login", loginController.studentLogin);
router.post("/student/google",loginController.studentGoogleLogin);
router.post("/student/linkedin",loginController.studentLinkedinLogin);
router.get("/student/profile",authenticateStudent,loginController.getStudentProfile);

module.exports = router;