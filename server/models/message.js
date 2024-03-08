const mongoose = require('mongoose')

// this model is for the messages being sent/ recieved
const messageSchema = new mongoose.Schema({
    Chatusers:{
        type:Array,
        require:true
    },
    message:{
        type:String,
        require:true
    },
    Sender:{
        type:mongoose.Schema.Types.ObjectId,
        require:true
    },
},
{
    timestamps:true
}
)

// this goes to the messages collection in mongo
const messageModel = mongoose.model("Message", messageSchema, "Message")
module.exports = messageModel