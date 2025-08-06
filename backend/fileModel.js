const mongoose=require('mongoose')

const fileSchema=new mongoose.Schema({

    roomId:String,

    filename:String,
})

 const  fileModel=mongoose.model('files',fileSchema);

 module.exports =fileModel;