const mysql = require('mysql2');
require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  console.log(`Connected to the employee_tracker_db database.`)
);

db.query(`SELECT * FROM roles`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(result);
});