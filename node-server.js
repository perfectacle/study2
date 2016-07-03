var express = require('express');
var app = express();
var fs = require('fs');

app.use(express.static('./www/public'))
    .listen(3303, function() {
        console.log('server start');
    });



app.get('/', function(req, res) {
    fs.readFile('index.html', function(err, data) {
        if(err) {
            console.log(err)
        } else {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.write(data);
            res.end();
        }
    })
});