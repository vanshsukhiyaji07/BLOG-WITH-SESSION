const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { isAuthenticated } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Blog routes - require authentication for home page
router.get('/', isAuthenticated, blogController.showBlogs);
router.get('/add', isAuthenticated, blogController.showAddBlog);
router.post('/add', isAuthenticated, upload.single('image'), blogController.addBlog);
router.get('/update', isAuthenticated, blogController.showUpdateBlog);
router.get('/delete/:id', isAuthenticated, blogController.deleteBlog);
router.get('/:id', isAuthenticated, blogController.showSingleBlog);

module.exports = router; 