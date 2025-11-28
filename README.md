# Student CRUD (Node.js + MySQL)

Simple Express app that connects to MySQL and does only:
- Show student list
- Add student
- Edit student
- Delete student
HTML + vanilla JS frontend, no templating engines.

## Prereqs
- Node.js 18+
- MySQL running locally or reachable over the network

## Setup
1) Install deps:
```
npm install
```

2) Create a database and table (matches your schema):
```sql
CREATE DATABASE STUDENTS;
USE STUDENTS;

CREATE TABLE students(
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
);
```

3) Configure environment:
Create a `.env` file in the project root:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=STUDENTS
```

## Run
```
npm start
```
Then open http://localhost:3000/

## Project files
- `server.js` – Express app + JSON API for list/add/edit/delete students.
- `db.js` – MySQL connection pool (using mysql2/promise).
- `public/index.html` – HTML + JS frontend that calls the API.
- `public/styles.css` – Minimal styling.
