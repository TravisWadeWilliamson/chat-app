(function() {
    console.log('linked upsie')
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
        if (status !== statusDefault) {
            let delay = setTimeout(function() {
                setStatus(statusDefault);
            }, 4000);
        }
    }

    // Connect to socket.io
    let socket = io.connect('http://localhost:3131');

    //Check for connection
    if (socket !== undefined) {
        console.log('Connected to socket')
    }

})();