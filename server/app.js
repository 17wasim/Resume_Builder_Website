// Import modules
require("dotenv").config(); 
const express = require("express");
const router = require("./routes/router"); 
const cors = require("cors");
const cookiParser = require("cookie-parser");

// Create an express app
const app = express();

// Middleware setup
app.use(express.json()); 
app.use(cookiParser());
app.use(cors()); 
app.use(router); 

// Import the database connection function
const connectToDB = require("./db/conn");

// Attempt to connect to the database
connectToDB()
  .then(() => {
    const port = 7000; 
    app.listen(port, () => {
      console.log(`server start at port no : ${port}`);
    });
  })
  .catch((error) => {
    console.error("Server cannot start. Database connection failed.");
  });
