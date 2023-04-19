require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res) => {
  res.render("home")
})

app.get("/artist-search", async (req, res) => {
  try {
    
    const artist = await spotifyApi.searchArtists(req.query.artistSearch)
    // console.log('The received data from the API: ', artist.body)

      // ----> 'HERE'S WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const {items} = artist.body.artists
    // console.log("API CALL:")
    // console.log(items)
    res.render("artist-search-results.hbs", {items})

  } catch (error) {
    console.log('The error while searching artists occurred: ', error)
  }
})

app.get('/albums/:artistId', async (req, res, next) => {
  // .getArtistAlbums() code goes here 
  try {
    const result = await spotifyApi.getArtistAlbums(req.params.artistId)
    const albums = result.body.items

    res.render("albums", {albums})

  } catch (error) {
    console.log(`You got an Error: ${error}`)
  }

});

app.get("/tracks/:albumId", async (req, res) => {
  try {
    const resultTrack = await spotifyApi.getAlbumTracks(req.params.albumId)
    const tracks = resultTrack.body.items
    console.log("Tracksss")
    console.log(tracks)

    res.render("tracks", {tracks})

  } catch (error) {
    console.log(`You got an Error: ${error}`)
  }

});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
