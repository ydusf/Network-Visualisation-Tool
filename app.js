require('dotenv').config(); // Load environment variables from a .env file

const express = require('express'); // Import the Express.js framework

const MongoStore = require('connect-mongo'); // Import the connect-mongo library for session storage

const { connectDB, disconnectDB } = require('./server/config/db'); // Import a custom module for connecting to MongoDB

// Import middleware for handling requests
const expressLayout = require('express-ejs-layouts'); // Layouts for EJS templates
const methodOverride = require('method-override'); // HTTP method override
const cookieParser = require('cookie-parser'); // Parse cookies from requests
const session = require('express-session'); // Manage user sessions
const flash = require('connect-flash'); // Flash messages

const app = express(); // Create an Express.js application

// Set the port for the application, default to 8000 if not defined
const PORT = process.env.PORT || 8000;

connectDB(); // Connect to the MongoDB database

// Middleware configuration
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies
app.use(methodOverride('_method')); // Enable HTTP method override
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

app.use(express.static('public')); // Serve static files from the 'public' directory

// Templating Engine Configuration
app.use(expressLayout); // Use EJS layouts
app.set('layout', './layouts/main'); // Define default layout for EJS templates
app.set('view engine', 'ejs'); // Set EJS as the view engine

// Routes Configuration
app.use('/', require('./server/routes/main')); // Use main routes
app.use('/', require('./server/routes/userRoutes')); // Use user routes
app.use('/', require('./server/routes/networkRoutes')); // Use network routes

// Start the server and listen on the specified port
module.exports = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
