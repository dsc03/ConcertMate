const express = require('express');
let app = express();
let bodyParser = require('body-parser');
let db = require('../database/index.js');
let spotifyRouter = require('./spotify-router.js');

let port = process.env.PORT || 8888;

app.use(express.static(__dirname + '/../client/dist'));

//spotify routes
app.use('/spotify', spotifyRouter);

app.get('/', (req, res, next) => {
  res.status(200);
  res.end();
})

app.listen(port, () => {
  console.log('Listening on ', port);
});