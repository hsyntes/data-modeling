const express = require("express");
const { verifyToken } = require("../controllers/authController");
const {
  createPost,
  getPosts,
  getPost,
  likePost,
  unlikePost,
} = require("../controllers/postController");

const commentRoutes = require("./commentRoutes");

const router = express.Router();

// * Protect after this
router.use(verifyToken);

router.get("/", getPosts);
router.get("/:id", getPost);

router.post("/create", createPost);

router.patch("/like/:id", likePost);
router.patch("/unlike/:id", unlikePost);

router.use("/:postId", commentRoutes);

module.exports = router;
