var express = require('express');
var app = express();

app.listen(3000);

app.use('/', express.static(__dirname + '/'));

console.log("Server running at http://127.0.0.1:3000/");