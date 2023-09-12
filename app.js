const express = require("express");
const expressRateLimit = require("express-rate-limit");
const expressMongoSanitize = require("express-rate-limit");
const helmet = require("helmet");
const hpp = require("hpp");
const xss = require("xss-clean");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const errorController = require("./controllers/errorController");

const app = express();

// * API Limit
const limit = expressRateLimit({
  max: 15,
  windowsMs: 60 * 60 * 1000,
  message: "Too many requests.",
  standartHeaders: true,
  legacyHeaders: false,
});

app.use(express.json({ limit }));

// * Security
app.use(expressMongoSanitize());
app.use(helmet());
app.use(hpp());
app.use(xss());

// * Routers
app.use("/data-modeling/users", userRoutes);
app.use("/data-modeling/posts", postRoutes);

// * Error Handling
app.use(errorController);

module.exports = app;
