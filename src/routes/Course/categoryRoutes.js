const express = require("express");
const router = express.Router();

const categoryController = require("../../controller/Course/categoryController");
const auth = require('../../middleware/auth');

router.post("/create", auth, categoryController.createCategory);
router.get("/get", categoryController.getCategories);
router.get("/get/slug/:slug",  categoryController.getCategoryBySlug);
router.get("/get/:id",  categoryController.getCategoryById);
router.put("/update/:id", auth, categoryController.updateCategory);
router.delete("/delete/:id", auth, categoryController.deleteCategory);

module.exports = router;