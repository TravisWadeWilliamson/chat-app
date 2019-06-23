let mongoose = require("mongoose");
let Schema = mongoose.Schema;

// Create the chatSchema with our schema class
let chatScheme = new Schema({
    // headline, a string, must be entered
    name: {
        type: String,
        required: true,
    },
    // summary, a string, must be entered
    message: {
        type: String,
        required: true,
    },

});

// Create the Headline model using the headlineSchema
let Chat = mongoose.model("Chat", chatScheme);

// Export the Headline model
module.exports = Chat;