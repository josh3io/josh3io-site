import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));


dotenv.config();

//setting up database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true
});

//routes
app.get('/', async (req, res) => {
  let sql = `SELECT authorId, firstName, lastName
             FROM q_authors
             ORDER BY lastName`;
  const [rows] = await pool.query(sql);

  sql = `SELECT DISTINCT category
             FROM q_quotes
             ORDER BY category`;
  const [categoryRows] = await pool.query(sql);
  res.render('index',{"authors":rows, "categories": categoryRows});
});

app.get("/dbTest", async(req, res) => {
  try {
    const [rows] = await pool.query("SELECT CURDATE()");
    res.send(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error");
  }
});//dbTest

app.get('/searchByKeyword', async (req, res) => {
  let keyword = req.query.keyword;
  let sql = `SELECT authorId, firstName, lastName, quote
             FROM q_quotes
             NATURAL JOIN q_authors
             WHERE quote LIKE ?`;
  let sqlParams = [`%${keyword}%`];
  const [rows] = await pool.query(sql, sqlParams);
  res.render("results", {"quotes":rows});
});

app.get('/searchByCategory', async (req, res) => {
  let sql = `SELECT authorId, firstName, lastName, quote
             FROM q_quotes
             NATURAL JOIN q_authors
             WHERE category = ?`;
  let sqlParams = [`${req.query.category}`];
  const [rows] = await pool.query(sql, sqlParams);
  res.render("results", {"quotes":rows});
});

app.get('/searchByLikes', async (req, res) => {
  let sql = `SELECT authorId, firstName, lastName, quote
             FROM q_quotes
             NATURAL JOIN q_authors
             WHERE likes BETWEEN ? AND ?`;
  let sqlParams = [req.query.minLikes, req.query.maxLikes];
  const [rows] = await pool.query(sql, sqlParams);
  res.render("results", {"quotes":rows});
});

app.get('/searchByAuthor', async (req, res) => {
  let authorId = req.query.authorId;
  let sql = `SELECT authorId, firstName, lastName, quote
             FROM q_quotes
             NATURAL JOIN q_authors
             WHERE authorId = ?`;
  let sqlParams = [authorId];
  const [rows] = await pool.query(sql, sqlParams);
  res.render("results", {"quotes":rows});
});

app.get('/api/author/:id', async (req,res) => {
  let authorId = req.params.id;
  let sql = `SELECT * FROM q_authors WHERE authorId = ?`;
  const [rows] = await pool.query(sql, [authorId]);
  res.send(rows);
});

app.listen(3000, ()=>{
  console.log("Express server running")
})


