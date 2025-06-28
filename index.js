const express = require('express');
const port = 9000
const app = express();

const path = require('path');
const db = require('./config/database');
const fs = require('fs');
const session = require('express-session');
const passport = require('passport');

// Import passport configuration
require('./config/passport');

// Import routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

// Import middleware
const { setLocals } = require('./middleware/auth');

// App configuration
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages middleware
app.use((req, res, next) => {
    res.locals.messages = req.session.messages;
    delete req.session.messages;
    next();
});

// Middleware
app.use(setLocals);

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Default route - redirect to welcome page
app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        // If authenticated, redirect to blogs
        res.redirect('/blogs');
    } else {
        // If not authenticated, redirect to welcome page
        res.redirect('/login')
    }
});

// Test route to check authentication status
app.get('/test-auth', (req, res) => {
    res.json({
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        session: req.session
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

// Routes
app.use('/', authRoutes);
app.use('/blogs', blogRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});