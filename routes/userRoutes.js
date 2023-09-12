const express = require("express");
const { signup, login } = require("../controllers/authController");
const {
  getUsers,
  getUser,
  follow,
  unfollow,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.get("/:id", getUser);

router.post("/signup", signup);
router.post("/login", login);

router.patch("/follow", follow);
router.patch("/unfollow", unfollow);

module.exports = router;
