const Student = require('../models/Student');
const s3Service = require('../services/s3Service');

// Get all students
const getAllStudents = async (_req, res) => {
  try {
    const students = await Student.getAll();
    res.json(students);
  } catch (err) {
    console.error('Failed to fetch students', err);
    res.status(500).json({ error: 'Failed to load students.' });
  }
};

// Create a new student with optional profile image
const createStudent = async (req, res) => {
  const { name, address, city, state, email, phone } = req.body;
  const required = { name, address, city, state, email, phone };
  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
  }

  try {
    // First create the student without image
    const newStudent = await Student.create(req.body, null);
    
    // Then upload image if provided, using the actual student ID
    if (req.file) {
      const profileImageUrl = await s3Service.uploadFile(req.file, newStudent.id);
      newStudent.profile_image = profileImageUrl;
      await Student.update(newStudent.id, {}, profileImageUrl);
    }

    res.status(201).json(newStudent);
  } catch (err) {
    console.error('Failed to add student', err);
    res.status(500).json({ error: 'Could not add student.' });
  }
};

// Update a student (with optional profile image update)
const updateStudent = async (req, res) => {
  const { name, address, city, state, email, phone } = req.body;
  const allowed = { name, address, city, state, email, phone };
  const providedFields = Object.fromEntries(
    Object.entries(allowed).filter(([, value]) => value !== undefined)
  );

  // If no fields and no file, return error
  if (Object.keys(providedFields).length === 0 && !req.file) {
    return res.status(400).json({ error: 'At least one field must be provided.' });
  }

  try {
    let profileImageUrl = null;

    // If file is uploaded, upload to S3
    if (req.file) {
      profileImageUrl = await s3Service.uploadFile(req.file, req.params.id);
    }

    const updatedStudent = await Student.update(req.params.id, providedFields, profileImageUrl);
    res.json(updatedStudent);
  } catch (err) {
    if (err.message === 'Student not found') {
      return res.status(404).json({ error: 'Student not found.' });
    }
    console.error('Failed to update student', err);
    res.status(500).json({ error: 'Could not update student.' });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  try {
    await Student.delete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    if (err.message === 'Student not found') {
      return res.status(404).json({ error: 'Student not found.' });
    }
    console.error('Failed to delete student', err);
    res.status(500).json({ error: 'Could not delete student.' });
  }
};

// Delete only profile image for a student
const deleteProfileImage = async (req, res) => {
  try {
    await Student.deleteProfileImage(req.params.id);
    res.json({ success: true });
  } catch (err) {
    if (err.message === 'Student not found') {
      return res.status(404).json({ error: 'Student not found.' });
    }
    console.error('Failed to delete profile image', err);
    res.status(500).json({ error: 'Could not delete profile image.' });
  }
};

module.exports = {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  deleteProfileImage
};
