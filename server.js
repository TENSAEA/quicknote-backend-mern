const express = require("express");
const dotenv = require("dotenv").config(); // process.env
const connectDB = require("./config/db");
const cors = require("cors");

const port = process.env.PORT;
connectDB();

const app = express();
// Enable CORS for all routes and origins
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/products", require("./routes/productRoute"));
app.use("/api/users", require("./routes/userRoutes"));
// Place this after all other app.use() and route calls
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(500).json({ error: error.message });
});
app.listen(port, () => console.log(`Server started on port ${port}`));
