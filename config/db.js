const mongoose = require("mongoose");
const connectDB = () => {
  // try {
  //   const conn = await mongoose.connect(process.env.MONGO_URI);
  //   console.log(`MongoDB connected: ${conn.connection.host}`);
  // } catch (error) {
  //   console.log(error);
  // }

  mongoose
    .connect(process.env.MONGO_URL)
    .then((conn) => {
      console.log("MongoDB connected" + `${conn.connection.host}`);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = connectDB;
