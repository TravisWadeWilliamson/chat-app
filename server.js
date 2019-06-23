var chatModel = require('./chat-model');
var mongoose = require('mongoose');
const mongo = require('mongodb').MongoClient;
const io = require('socket.io').listen(3001).sockets;

//Connect to mongodb
mongoose.connect('mongodb://localhost/mongochat', { useNewUrlParser: true }, function() {

    console.log('MongoDB connected...!!!');

    //Connect to socket.io
    io.on('connection', function(socket) {

        console.log('user connected');

        //Create function to send status to user from server
        sendStatus = function(status) {
            socket.emit('status', status);
        }

        // Get chats from mongo collection
        chatModel.find({}).sort({ _id: -1 })
            .then(function(res) {

                // //Emit messages to the user
                socket.emit('output', res);
                // console.log(res)
            });



        // // Handle input events from the user
        // socket.on('input', function(data) {
        //     let name = data.name;
        //     let message = data.message;
        //     console.log('inside input', data);

        //     //Check for name and message
        //     if (name == '' || message == '') {
        //         sendStatus('Please enter name and message.');
        //     } else {

        //         //Insert message into DB
        //         chat.insert({ name: name, message: message }, function() {

        //             //Emit output back to user
        //             io.emit('output', [data]);
        //             console.log('output', [data])
        //                 //Send status object
        //             sendStatus({
        //                 message: 'Message sent.',
        //                 clear: true
        //             });
        //         });
        //     }
        // });

        // // Handle clear
        // socket.on('clear', function(data) {

        //     //Remove all chats from the collectionnp
        //     chat.remove({}, function() {

        //         //Emit messages have been cleared
        //         socket.emit('Chat history cleared.')
        //     });
        // });
    });
});