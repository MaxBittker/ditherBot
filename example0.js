var fs = require('fs')

fs.readFile('data/genres.json', function(err, data) {
    if (err) throw err;

    var genres = JSON.parse(data.toString()).genres
    console.log(genres[2]);
});

console.log('this prints before')
