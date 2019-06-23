let element = function(id) {
  return document.getElementById(id);
};

//Get Elements
let status = element("status");
let messages = element("messages");
let textarea = element("textarea");
let username = element("username");
let clearBtn = element("clear");

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
};
// Handle input
textarea.addEventListener("keydown", function(event) {
  console.log({
    name: username.value,
    message: textarea.value
  });
  if (event.which === 13 && event.shiftKey === false) {
    //Emit to server input
    socket.emit("outputMsg", {
      name: username.value,
      message: textarea.value
    });

    event.preventDefault();
  }
});

var socket = io.connect("http://localhost");

socket.on("messageSend", function(data) {
  if (data.length) {
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      //Build out message div
      let message = document.createElement("div");
      message.setAttribute("class", "chat-message");
      message.textContent = data[i].name + ": " + data[i].message;
      messages.appendChild(message);
    }
  }
});
