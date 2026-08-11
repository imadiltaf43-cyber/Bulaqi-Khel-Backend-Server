const express = require("express");

const router = express.Router();

const {

    getProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,

} = require("../controllers/projectController");

const { uploadProjectGallery } = require("../middleware/uploadMultiple");

const {
    protect,
} = require("../middleware/authMiddleware");

const {
    admin,
} = require("../middleware/adminMiddleware");

router.get("/", getProjects);

router.get("/:id", getProject);

router.post(
    "/",
    protect,
    admin,
    uploadProjectGallery,
    createProject
);

router.put(
    "/:id",
    protect,
    admin,
    uploadProjectGallery,
    updateProject
);

router.delete(
    "/:id",
    protect,
    admin,
    deleteProject
);

module.exports = router;