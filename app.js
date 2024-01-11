// Load environment variables from a .env file
require("dotenv").config();

// Import the Express.js framework
const express = require("express");

// Import the connect-mongo library for session storage
const MongoStore = require("connect-mongo");

// Import a custom module for connecting to MongoDB
const connectDB = require("./server/config/db");

// Import middleware for handling requests
const expressLayout = require("express-ejs-layouts"); // Layouts for EJS templates
const methodOverride = require("method-override"); // HTTP method override
const cookieParser = require("cookie-parser"); // Parse cookies from requests
const session = require("express-session"); // Manage user sessions
const csvtojson = require("csvtojson");
const fileUpload = require("express-fileupload");
const flash = require("connect-flash");

// Create an Express.js application
const app = express();

// Set the port for the application, default to 8000 if not defined
const PORT = process.env.PORT || 8000;

// Connect to the MongoDB database
connectDB();

// Middleware configuration
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use(methodOverride("_method")); // Enable HTTP method override
app.use(fileUpload());
app.use(flash());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY, // Secret for session data
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI, // MongoDB connection URI
    }),
  })
);

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Templating Engine Configuration
app.use(expressLayout); // Use EJS layouts
app.set("layout", "./layouts/main"); // Define default layout for EJS templates
app.set("view engine", "ejs"); // Set EJS as the view engine

// Routes Configuration
app.use("/", require("./server/routes/main")); // Use main routes

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
