const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(3131).sockets;

//Connect to mongodb
mongo.connect("mongodb://localhost/populatedb", { useNewUrlParser: true }, function(err, db) {
    if (err) {
        throw err;
    }
    console.log('MongoDB connected...!!!');
    //Connect to socket.io
    client.on('connection', function(socket) {
        let chat = db.collection('chats');

        //Create function to send status to client
        sendStatus = function(status) {
                socket.emit('status', status)
            }
            //Get chats from mongo collection
        chat.find().limit(1000).sort({ _id: 1 }).toArray(function(err, res) {
            if (err) {
                throw err;
            }

            //Emit messages to the client
            socket.emit('output', res);
        });

        // Handle input events
        socket.on('input', function(data) {
            let name = data.name;
            let message = data.message;

            //Check for name and message
            if (name === '' || message === '') {
                sendStatus('Please enter name and message.')
            } else {
                //Insert message into DB
                chat.insert({ name: name, message: message }, function() {
                    //Emit output back to client
                    client.emit('output', [data]);

                    //Send status object
                    sendStatus({
                        message: 'Message sent.',
                        clear: true
                    })
                });
            }
        });

        //Handle clear
        socket.on('clear', function(data) {
            //Remove all chats from the collection
            chat.remove({}, function() {
                //Emit messages have been cleared
                socket.emit('Chat history cleared.')
            })
        })
    });
});