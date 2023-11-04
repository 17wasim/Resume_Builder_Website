const mongoose = require("mongoose");

// Function to connect to the database
const connectToDB = () => {
  const DB = process.env.DATABASE

  return mongoose
    .connect(DB, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("DataBase Connected");
    })
    .catch((error) => {
      console.log("Error connecting to database:", error.message);
      throw error;
    });
};

module.exports = connectToDB;