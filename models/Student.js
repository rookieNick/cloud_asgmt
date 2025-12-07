const pool = require('../config/database');
const s3Service = require('../services/s3Service');

class Student {
  // Fetch all students
  static async getAll() {
    const [students] = await pool.query(
      'SELECT id, name, address, city, state, email, phone, profile_image FROM students ORDER BY id DESC'
    );
    return students;
  }

  // Create a new student
  static async create(studentData, profileImageUrl = null) {
    const { name, address, city, state, email, phone } = studentData;
    const [result] = await pool.query(
      'INSERT INTO students (name, address, city, state, email, phone, profile_image) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, address, city, state, email, phone, profileImageUrl]
    );
    return {
      id: result.insertId,
      name,
      address,
      city,
      state,
      email,
      phone,
      profile_image: profileImageUrl
    };
  }

  // Update a student by ID (supports partial updates)
  static async update(id, studentData, profileImageUrl = null) {
    const fields = [];
    const values = [];
    const allowed = ['name', 'address', 'city', 'state', 'email', 'phone'];

    // Build dynamic query based on provided fields
    allowed.forEach(field => {
      if (studentData[field] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(studentData[field]);
      }
    });

    // Handle profile image update
    if (profileImageUrl !== null) {
      fields.push('profile_image = ?');
      values.push(profileImageUrl);
    }

    if (fields.length === 0) {
      throw new Error('No valid fields to update');
    }

    values.push(id);

    const query = `UPDATE students SET ${fields.join(', ')} WHERE id = ?`;
    const [result] = await pool.query(query, values);

    if (result.affectedRows === 0) {
      throw new Error('Student not found');
    }

    // Fetch and return updated student
    const [updatedStudent] = await pool.query(
      'SELECT id, name, address, city, state, email, phone, profile_image FROM students WHERE id = ?',
      [id]
    );
    return updatedStudent[0];
  }

  // Delete a student by ID
  static async delete(id) {
    // Get student to retrieve profile image URL
    const [student] = await pool.query(
      'SELECT profile_image FROM students WHERE id = ?',
      [id]
    );

    if (student.length === 0) {
      throw new Error('Student not found');
    }

    // Delete profile image from S3 if it exists
    if (student[0].profile_image) {
      await s3Service.deleteFile(student[0].profile_image);
    }

    // Delete student from database
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      throw new Error('Student not found');
    }
    return { success: true };
  }

  // Delete only profile image
  static async deleteProfileImage(id) {
    const [student] = await pool.query(
      'SELECT profile_image FROM students WHERE id = ?',
      [id]
    );

    if (student.length === 0) {
      throw new Error('Student not found');
    }

    if (student[0].profile_image) {
      await s3Service.deleteFile(student[0].profile_image);
      await pool.query(
        'UPDATE students SET profile_image = NULL WHERE id = ?',
        [id]
      );
    }

    return { success: true };
  }
}

module.exports = Student;
