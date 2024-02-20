const mongoose = require('mongoose')

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

const messageModel = mongoose.model("Message", messageSchema, "Message")
module.exports = messageModel