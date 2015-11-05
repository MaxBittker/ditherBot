var Twit = require('twit');
var T = new Twit(require('./config.js'));
var request = require('request');
var fs = require("fs");
var gm = require("gm").subClass({
    imageMagick: true
});

var stream = T.stream('statuses/filter', {
    track: ['@DitheredBot']
})

stream.on('tweet', function(tweet) {
    if (tweet.entities.media == undefined)
        return

    var imgurl = tweet.entities.media[0].media_url
    var id = imgurl.split("/")[4]

    var name = tweet.user.screen_name;
    var nameID = tweet.id_str;

    var outputFileName = 'output/' + id

    var stream = request(imgurl)

    gm(stream, outputFileName).normalize().noise("gaussian").monochrome().write(outputFileName, function(err) {
        if (!err) {
            console.log('wrote: ' + id);
            tweetImage(outputFileName, name, nameID)
        } else
            console.log(err)

    });

})


function tweetImage(path, name, nameID) {

    fs.readFile(path, {
            encoding: 'base64'
        },

        function(err, buf) {
            var b64content = buf

            T.post('media/upload', {
                media_data: b64content
            }, function(err, data, response) {

                var mediaIdStr = data.media_id_string
                var params = {
                    status: 'dithered!' + ' @' + name,
                    media_ids: [mediaIdStr],
                    in_reply_to_status_id: nameID
                }

                T.post('statuses/update', params, function(err, data, response) {
                    console.log('tweeted: ' + params.status)
                })

                fs.unlink(path, function() {})
            })
        });
}
