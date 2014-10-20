var express = require("express");
var socket = require("socket.io");
var http = require("http");

var app = express();
var server = http.createServer(app);

var io = socket.listen(server);

//console.log('Express server started on port %s', app);

  io.sockets.on("connection",function(client)
  {

    client.on("join",function(data){
      client.nickname=data;
    });
    console.log("Client connected");
    //client.emit('connection', { userId: client.id});
    var room = "General";
    client.join(room);
    client.on("messages",function(data){
            var chatstr = (client.nickname?client.nickname:"user")+": "+data;
            client.broadcast.to(room).emit("messages",chatstr);
            //client.emit("messages",chatstr);
            console.log(chatstr);
        
      });
    client.emit("messages",'Welcome to localhost:8080');
  });

  server.listen(8080);




