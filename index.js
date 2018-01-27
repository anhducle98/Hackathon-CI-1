'use strict';

var express = require('express');
var app = express();
var http = require('http').Server(app);
app.use(express.static(__dirname));
let port = process.env.PORT || 6969;
http.listen(port, function(){
  console.log('Server started. Listening on *:' + port);
});