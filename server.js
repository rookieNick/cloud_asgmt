require('dotenv').config();
const express = require('express');
const path = require('path');
const studentRoutes = require('./routes/students');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API routes
app.use('/api/students', studentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// Set port and listen for requests
const app_port = process.env.APP_PORT || 3000;
app.listen(app_port, () => {
    console.log(`Server is running on port ${app_port}.`);
});