var chatModel = require("./chat-model");
var mongoose = require("mongoose");
const express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(80);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.use(express.static("public"));

//Connect to mongodb
mongoose.connect(
  "mongodb://admin2:abc123@ds261616.mlab.com:61616/heroku_l4pd93qm",
  { useNewUrlParser: true },
  function() {
    console.log("MongoDB connected...!!!");

    io.on("connection", function(socket) {
      chatModel
        .find({})
        .sort({ _id: 1 })
        .then(function(res) {
          //send messages to the client
          socket.emit("messageSend", res);
        });

      //   console.log(socket.id);

      socket.on("outputMsg", function(newMsg) {
        new chatModel(newMsg)
          .save()
          .then(msg => {
            io.emit("messageSend", [msg]);
          })
          .catch(err => console.error(err));
      });
    });
  }
);
