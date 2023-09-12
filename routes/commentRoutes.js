const express = require("express");
const { makeComment } = require("../controllers/commentController");

const router = express.Router({ mergeParams: true });

router.post("/comment", makeComment);

module.exports = router;
