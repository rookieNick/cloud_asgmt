const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const upload = require('../config/multer');

// Get all students
router.get('/', studentController.getAllStudents);

// Create a new student (with optional profile image upload)
router.post('/', upload.single('profile_image'), studentController.createStudent);

// Update a student (with optional profile image upload)
router.put('/:id', upload.single('profile_image'), studentController.updateStudent);

// Delete a student
router.delete('/:id', studentController.deleteStudent);

// Delete only profile image for a student
router.delete('/:id/profile-image', studentController.deleteProfileImage);

module.exports = router;
