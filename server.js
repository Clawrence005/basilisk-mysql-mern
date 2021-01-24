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
  'SELECT * FROM users ORDER by id DESC',
  (err, results) => {
    if (err) throw err;

    res.send(results);
  }
));

//get one user by id
app.get('/api/users/:id', (req, res) => {
  const id = req.params.id;
  connection.query(
    'SELECT * FROM users WHERE id = ?', id,
    (err, result) => {
      if (err) throw err;
      if (result.length === 0) { res.send('no user found') }
      else { res.send(result) };
    });
});

// create new user
app.post('/api/users', function (req, res) {
  let sql = `INSERT INTO users(user_name, email, bio, user_image) VALUES (?)`;
  let values = [
    req.body.user_name,
    req.body.email,
    req.body.bio,
    req.body.user_image
  ];
  connection.query(sql, [values], function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: `New user ${values[0]} added successfully`
    })
  })
});

//update user by id
app.put('/api/users/:id', (req, res) => {
  const id = req.params.id;
  let values = [
    req.body.user_name,
    req.body.email,
    req.body.bio,
    req.body.userImage
  ];

  connection.query('UPDATE users SET userName=?, email=?, bio=?, userImage=? WHERE id= ?', [values[0], values[1], values[2], values[3], id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows < 1) { res.send('error encountered while updating') }
    else if (result.affectedRows >= 1) { res.send(`user id ${id} updated`) }
  });
});

//delete user by id
app.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  connection.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows < 1) { res.send('no user id found') }
    else if (result.affectedRows >= 1) { res.send(`user id ${id} deleted`) }
    console.log(result)
  })
});

// Cocktail Routes ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// get all cocktails
// app.get('/api/cocktails', (req, res) => {
//   let sql = 
// });

app.get('/api/cocktails', (req, res) => connection.query(
  'SELECT * FROM cocktails ORDER by id DESC',
  (err, results) => {
    if (err) throw err;

    res.send(results);
  }
));
// get one cocktail by id

// post new cocktail
app.post('/api/cocktails', (req, res) => {
  let sql = `INSERT INTO cocktails(  cocktail_name, creator_name, cocktail_image, ingredients, method, glass, garnish) VALUES (?)`;
  let values = [
    req.body.cocktail_name,
    req.body.creator_name,
    req.body.cocktail_image,
    req.body.ingredients,
    req.body.method,
    req.body.glass,
    req.body.garnish,
    // req.body.created_at,
    // req.body.updated_at
    // ALTER TABLE `table1` ADD `lastUpdated` TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ;
  ];
  connection.query(sql, [values], function (err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      message: `new cocktail ${values[0]} added successfully`
    })
  })
});

// update cocktail

// delete cocktail by id


app.listen(5000, () => {
  console.log(`Server is running on ${PORT}`.cyan.bold);
});
