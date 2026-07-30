import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

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
app.get('/', (req, res) => {
   res.render('index')
});

app.get("/authors", async function(req, res){
 let sql = `SELECT *
            FROM q_authors
            ORDER BY lastName`;
 const [rows] = await pool.query(sql);
 res.render("authorList", {"authors":rows});
});


app.get("/author/new", (req,res) => {
  res.render("newAuthor")
});

app.post("/author/new", async function(req, res){
  let fName = req.body.fName;
  let lName = req.body.lName;
  let birthDate = req.body.birthDate;
  let deathDate = req.body.deathDate;
  let sex = req.body.sex;
  let profession = req.body.profession;
  let country = req.body.country;
  let portrait = req.body.portrait;
  let biography = req.body.biography;
  let sql = `INSERT INTO q_authors
             (firstName, lastName, dob, dod, sex, profession, country, portrait, biography)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  let params = [fName, lName, birthDate, dod, sex, profession, country, portrait, biography];
  const [rows] = await pool.query(sql, params);
  res.render("newAuthor",
             {"message": "Author added!"});
});

app.get("/author/edit", async function(req, res){


 let authorId = req.query.authorId;


 let sql = `SELECT *,
        DATE_FORMAT(dob, '%Y-%m-%d') dobISO
        FROM q_authors
        WHERE authorId =  ?`;
 const [rows] = await pool.query(sql, authorId);
 res.render("editAuthor", rows[0]);
});

app.post("/author/edit", async function(req, res){
  let sql = `UPDATE q_authors
            SET firstName = ?,
                lastName = ?,
                dob = ?,
                sex = ?,
                profession = ?,
                country = ?,
                portrait = ?,
                biography = ?
            WHERE authorId =  ?`;


  let params = [req.body.fName,
              req.body.lName, req.body.dob,
              req.body.sex,
              req.body.profession,
              req.body.country,
              req.body.portrait,
              req.body.biography,
              req.body.authorId];
  const [rows] = await pool.query(sql,params);
  res.redirect("/authors");
});

app.get("/author/delete", async (req, res) => {
  let authorId = req.query.authorId;

  let sql = `DELETE FROM q_authors WHERE authorId = ?`;
  const [rows] = await pool.query(sql, [authorId]);
  res.redirect("/authors");
});


app.get("/quotes", async function(req, res){
 let sql = `SELECT *
            FROM q_quotes
            ORDER BY quoteId`;
 const [rows] = await pool.query(sql);
 res.render("quoteList", {"quotes":rows});
});


app.get("/quote/new", async (req,res) => {
  let sql = `SELECT authorId, firstName, lastName FROM q_authors ORDER BY lastName`
  const [authorRows] = await pool.query(sql)

  res.render("newQuote", {"authors": authorRows})
});

app.post("/quote/new", async function(req, res){
  let quote = req.body.quote;
  let authorId = req.body.authorId;
  let category = req.body.category;
  let sql = `INSERT INTO q_quotes
             (quote, authorId, category)
              VALUES (?, ?, ?)`;
  let params = [quote, authorId, category];
  const [rows] = await pool.query(sql, params);

  sql = `SELECT authorId, firstName, lastName FROM q_authors ORDER BY lastName`
  const [authorRows] = await pool.query(sql)
  res.render("newQuote",
             {"message": "Quote added!", "authors": authorRows});
});

app.get("/quote/edit", async function(req, res){
  let quoteId = req.query.quoteId;

  let sql = `SELECT *
        FROM q_quotes
        WHERE quoteId =  ?`;
  const [rows] = await pool.query(sql, quoteId);

  sql = `SELECT authorId, firstName, lastName FROM q_authors ORDER BY lastName`
  const [authorRows] = await pool.query(sql)

  res.render("editQuote", {"quote": rows[0], "authors": authorRows});
});

app.post("/quote/edit", async function(req, res){
  let sql = `UPDATE q_quotes
            SET quote = ?,
                authorId = ?,
                category = ?
            WHERE quoteId =  ?`;

  let params = [req.body.quote,
              req.body.authorId, req.body.category,
              req.body.quoteId];
  console.log(params)
  const [rows] = await pool.query(sql,params);
  res.redirect("/quotes");
});

app.get("/quote/delete", async (req, res) => {
  let quoteId = req.query.quoteId;

  let sql = `DELETE FROM q_quotes WHERE quoteId = ?`;
  const [rows] = await pool.query(sql, [quoteId]);
  res.redirect("/quotes");
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

app.listen(3000, ()=>{
  console.log("Express server running")
})
