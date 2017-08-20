var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {



  res.render('../views/index.hbs', {
    pageTitle: 'Home',
    pageId: 'home',
    title: 'This is a title'/*,
    song1: dataFile.songs[song1].title + "    by    " + dataFile.songs[song1].artist,
    song2: dataFile.songs[song2].title + "    by    " + dataFile.songs[song2].artist,
    song3: dataFile.songs[song3].title + "    by    " + dataFile.songs[song3].artist,
    song4: dataFile.songs[song4].title + "    by    " + dataFile.songs[song4].artist*/
  });
});


module.exports = router;
