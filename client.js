(function() {
    console.log('linked upsie')

    // Create a function called element to select ids
    let element = function(id) {
        return document.getElementById(id)
    }

    //Get Elements
    let status = element('status');
    let messages = element('messages');
    let textarea = element('textarea');
    let username = element('username');
    let clearBtn = element('clear');

    //Set default status
    let statusDefault = status.textContent;

    let setStatus = function(status) {

        //Set status
        status.textContent = status;

        //clear status after 4 secs
        if (status !== statusDefault) {
            let delay = setTimeout(function() {
                setStatus(statusDefault);
            }, 4000);
        }
    }

    // Connect to socket.io
    let socket = io.connect('http://localhost:3001');
    console.log('socket?', socket);


    //Check for connection
    if (socket !== undefined) {
        console.log('Connected to socket...');

        // Handle output
        socket.on('output', function(data) {
            if (data.length) {
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    //Build out message div
                    let message = document.createElement('div');
                    message.setAttribute('class', 'chat-message');
                    message.textContent = data[i].name + ': ' + data[i].message;
                    messages.appendChild(message);
                    messages.insertBefore(message, messages.firstChild);

                }
            }
        });

        // Handle input
        textarea.addEventListener('keydown', function(event) {
            console.log("keydown", event)
            if (event.which === 13 && event.shiftKey === false) {
                //Emit to server input
                socket.emit('input', {
                    name: username.value,
                    message: textarea.value
                });

                event.preventDefault();
            }
        });

        //Get status from server
        socket.on('status', function(data) {
            // Get message status
            setStatus((typeof data === 'object') ? data.message : data);

            // If status is clear, clear text
            if (data.clear) {
                textarea.value = '';
            }

        });

        // //Handle chat clear
        // clearBtn.addEventListener('click', function() {
        //     socket.emit('clear');
        // });

        // // Clear message
        // socket.on('cleared', function() {
        //     messages.textContent = '';
        // });
    }

})();