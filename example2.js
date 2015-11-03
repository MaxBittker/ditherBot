var Twit = require('twit');
var T = new Twit(require('./config.js'));

var stream = T.stream('statuses/filter', {
    track: ['had a dream']
})

stream.on('tweet', function(tweet) {

    console.log(tweet.text + '\n')

    T.post('statuses/retweet/:id', {
        id: tweet.id_str
    }, function(err, data, response) {
        if (err) console.log(err)
    })
})
