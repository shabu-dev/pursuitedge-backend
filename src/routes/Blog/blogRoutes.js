const express = require('express');
const router = express.Router();
const blogController = require('../../controller/Blog/blogController');
const upload = require("../../middleware/upload");
const auth = require('../../middleware/auth');

// Create
router.post( "/create", auth, upload("blog").single("cover_image"), blogController.createBlog);

// Public - published + active
router.get("/get", blogController.getBlogs);

// Get everything
router.get("/get/all", auth, blogController.getAllBlogs);

// Get by slug
router.get( "/slug/:slug", blogController.getBlogBySlug);

// Get by ID
router.get( "/get/:id",  blogController.getBlogById);

// Update
router.put( "/update/:id", auth, upload("blog").single("cover_image"), blogController.updateBlog);

// Soft delete
router.delete("/delete/:id", auth, blogController.deleteBlog);

// Update reading time
router.post( "/read-time/:id/read-time", blogController.updateReadTime);


module.exports = router;
