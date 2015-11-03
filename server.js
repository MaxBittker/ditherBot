// Our Twitter library
var Twit = require('twit');

// We need to include our configuration file
var T = new Twit(require('./config.js'));
var request = require('request');
var fs = require("fs");
var gm = require("gm").subClass({
    imageMagick: true
});

function watchTag() {

    var stream = T.stream('statuses/filter', {
        // track: ['art']
        track: ['@DitheredBot']
    })

    stream.on('tweet', function(tweet) {
        try {
            var imgurl = tweet.entities.media[0].media_url
            var id = imgurl.split("/")[4]
            var outputFileName = 'output/' + id
            var nameID = tweet.id_str;
            var name = tweet.user.screen_name;

            var stream = request(imgurl)
            gm(stream, outputFileName).normalize().monochrome().write(outputFileName, function(err) {

                if (!err) {
                    console.log('wrote: ' + id);
                    // console.log(name)
                    tweetImage(outputFileName, name, nameID)
                }

            });

        } catch (e) {
            // console.log(e)
        }
    })


}

function tweetImage(path, name, nameID) {

    fs.readFile(path, {
            encoding: 'base64'
        },
        
        function(err, buf) {
            var b64content = buf

            T.post('media/upload', {
                media_data: b64content
            }, function(err, data, response) {
                // now we can reference the media and post a tweet (media will attach to the tweet)
                var mediaIdStr = data.media_id_string
                var params = {
                    // status: '#dithered',
                    media_ids: [mediaIdStr],
                    in_reply_to_status_id: nameID,
                    status: 'dithered!' + ' @' + name
                }

                T.post('statuses/update', params, function(err, data, response) {
                    // console.log(data)
                    console.log('tweeted: ' + params.status)
                })
                fs.unlink(path, function() {})
            })
        });
}


watchTag();
