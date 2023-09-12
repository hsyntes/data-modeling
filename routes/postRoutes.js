const express = require("express");
const { verifyToken } = require("../controllers/authController");
const {
  createPost,
  getPosts,
  getPost,
} = require("../controllers/postController");

const router = express.Router();

// * Protect after this
router.use(verifyToken);

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", createPost);

module.exports = router;
