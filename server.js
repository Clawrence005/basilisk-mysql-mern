const express = require('express');
const bodyParser = require('body-parser');
const colors = require('colors');
const dotenv = require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.HOST,
  port: 3306,
  user: 'root',
  password: process.env.PASSWORD,
  database: process.env.DATABASE_NAME
})
// const connection = mysql.createConnection({
//   host: 'localhost',
//   port: 3306,
//   user: 'root',
//   password: '',
//   database: 'database_name'
// })

// Display all users
app.get('/api/users', (req, res) => connection.query(
  'SELECT * FROM users',
  (err, results) => {
    if (err) throw err;

    res.send(results);
  }));


// create new user
app.post('/api/users', function (req, res) {
  let sql = `INSERT INTO users(userName, email, bio, userImage) VALUES (?)`;
  let values = [
    req.body.userName,
    req.body.email,
    req.body.bio,
    req.body.userImage
  ];
  connection.query(sql, [values], function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: "New user added successfully"
    })
  })
});

app.listen(5000, () => {
  console.log(`Server is running on ${PORT}`.cyan.bold);
});
