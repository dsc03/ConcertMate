let router = require('express').Router();
let axios = require('axios');
let bodyParser = require('body-parser');
let helpers = require('./spotify-helpers.js');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

let spotifyCredentials = {
	client_id: '1b4dd6acf0c14120b5fa6ae37b4c773a',
	client_secret: '365aec3923fe452fbbeb31fe842c2a4c',
	redirect_uri: 'http://localhost:8888/spotify/callback/'
};

let token = undefined;

let tokenHeader = {
	'Authorization': 'Bearer ' + token
};

let scopes = ['user-read-private', 'user-read-email'];

//start authentication flow on refresh
router.get('/login', (req, res) => {

	let encodedClientId = encodeURIComponent(spotifyCredentials.client_id)
	let encodedRedirectURI = encodeURIComponent(spotifyCredentials.redirect_uri);
	let authorizeURL = `https://accounts.spotify.com/authorize?client_id=${encodedClientId}&redirect_uri=${encodedRedirectURI}&scope=user-read-private%20user-read-email&response_type=token`;
	res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.send(authorizeURL);

});

//callback route
router.get('/callback', (req, res) => {
	res.redirect('http://localhost:8888');
});

//save token
router.post('/login', (req, res) => {
	token = req.body.data;
	res.status(200).send();
})

//handle playlist search submission
router.post('/search', bodyParser.json(), (req, res) => {
	let artist = encodeURI(req.body.artist);
	let token = req.body.token;
	//why isn't header saved?
	axios.get(`https://api.spotify.com/v1/search?q=${artist}&type=artist&market=US&limit=10`, {
			headers: {
				'Authorization': 'Bearer ' + token
			}		
		})
	//might need to get the userID as well....
	.then((artists) => {
		console.log(artists);
		console.log('1st artist: ', artists.data.artists.items[0]);
		let artistId = artists.data.artists.items[0].id;
		let artistData = {
			artistId: artistId,
		}
		res.send(artistData);
	})
	.catch((error) => {
		//console.log('Error getting API data: ', error);
		res.status(404).send('Error');
	});

});

module.exports = router;