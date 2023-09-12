const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");
const http = require("http");

// * Uncaught exception
process.on("uncaughtException", (err) => {
  console.error(`${err.name}. Server is shutting down.`);
  console.log(err.message);

  process.exit(1);
});

dotenv.config({ path: "./config.env" });

// * MongoDB connection
(async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("Connecting to the database successful.");
  } catch (e) {
    console.error(`Connecting to the database failed.`);
  }
})();

// * Create server
const server = http.createServer(app);

// * Listen to the server
server.listen(process.env.PORT, () =>
  console.log(`Server is running on PORT: ${process.env.PORT}`)
);

// * Unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.log(`${err.name}. Server is shutting down.`);
  console.log(err.message);

  process.exit(() => server.close());
});
