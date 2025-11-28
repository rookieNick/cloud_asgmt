require('dotenv').config();
const express = require('express');
const path = require('path');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/students', async (_req, res) => {
  try {
    const [students] = await pool.query(
      'SELECT id, name, address, city, state, email, phone FROM students ORDER BY id DESC'
    );
    res.json(students);
  } catch (err) {
    console.error('Failed to fetch students', err);
    res.status(500).json({ error: 'Failed to load students.' });
  }
});

app.post('/api/students', async (req, res) => {
  const { name, address, city, state, email, phone } = req.body;
  const required = { name, address, city, state, email, phone };
  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length) {
    return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO students (name, address, city, state, email, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [name, address, city, state, email, phone]
    );
    res.status(201).json({
      id: result.insertId,
      name,
      address,
      city,
      state,
      email,
      phone
    });
  } catch (err) {
    console.error('Failed to add student', err);
    res.status(500).json({ error: 'Could not add student.' });
  }
});

app.put('/api/students/:id', async (req, res) => {
  const { name, address, city, state, email, phone } = req.body;
  const required = { name, address, city, state, email, phone };
  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length) {
    return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
  }

  try {
    const [result] = await pool.query(
      'UPDATE students SET name = ?, address = ?, city = ?, state = ?, email = ?, phone = ? WHERE id = ?',
      [name, address, city, state, email, phone, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    res.json({
      id: Number(req.params.id),
      name,
      address,
      city,
      state,
      email,
      phone
    });
  } catch (err) {
    console.error('Failed to update student', err);
    res.status(500).json({ error: 'Could not update student.' });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM students WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to delete student', err);
    res.status(500).json({ error: 'Could not delete student.' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
