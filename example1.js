var Twit = require('twit');
var corpora = require('corpora-project');
var T = new Twit(require('./config.js'));

var genres = corpora.getFile('music', 'genres').genres
var isms = corpora.getFile('art', 'isms').isms;

function tweetStatus() {
    var newStatus = genStatus()
    T.post('statuses/update', {
        status: newStatus
    }, function(err, data, response) {
        if (err)
            console.log(err)
        else
            console.log(data.text)
    })
}

function genStatus() {
    var status = returnRandom(isms).replace('ism', 'ist') + ' ' + returnRandom(genres)
    status = status.toLowerCase()
    return status
}

function returnRandom(array) {
    return array[(array.length * Math.random()) | 0]
}


setInterval(tweetStatus, 1000 * 5);
