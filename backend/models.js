const mongoose=require('mongoose')

const chatSchema=new mongoose.Schema({
    data:String,
    time: String,
    by:String,
    roomId:String,
    file:Boolean,
    filename:String,
})

 const  chat=mongoose.model('chat',chatSchema);

 module.exports =chat;