import express from 'express';
import fetch from 'node-fetch';

const {randomSuperhero} = await import('superheroes');

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const getUnsplashImage = async () => {
  let apiKey = "u8dyFrle4ODSt-aEzzTuOmZRCUh9E5TQHT6B0lHUe8o";
	let url = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&featured=true&query=computer`;
  let response = await fetch(url);
  let data = await response.json();
  return data.urls.full;
}

app.get('/', async (req, res) => {
  res.render("index");

});

app.get('/computer_image', async (req,res) => {

  res.send({"image": await getUnsplashImage()});
});

app.get('/c', async (req,res) => {
  console.log(req.originalUrl)
  res.render("c", {"lang":req.originalUrl.substr(1)});
});
app.get('/js', async (req,res) => {
  console.log(req.originalUrl)
  res.render("js", {"lang":req.originalUrl.substr(1)});
});
app.get('/rust', async (req,res) => {
  console.log(req.originalUrl)
  res.render("rust", {"lang":req.originalUrl.substr(1)});
})

app.get('/helloWorld', async (req, res) => {
  let lang = req.query.lang;
  res.render("helloWorld", {lang, "hero": randomSuperhero() });
});

app.listen(3000, () => {
  console.log('server started');
});



