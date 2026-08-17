const express = require("express");
const router = express.Router();

const categoryController = require("../../controller/Course/categoryController");

router.post("/create", categoryController.createCategory);
router.get("/get", categoryController.getCategories);
router.get("/get/slug/:slug", categoryController.getCategoryBySlug);
router.get("/get/:id", categoryController.getCategoryById);
router.put("/update/:id", categoryController.updateCategory);
router.delete("/delete/:id", categoryController.deleteCategory);

module.exports = router;