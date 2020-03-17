const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    seatNumber : {type:Number , required:true},
    busNumber : {type : String , required:true , ref:'Bus'},
    name : {type:String , required:true},
    age : {type:String , required:true} ,
    currentStatus : String
});

module.exports = mongoose.model('Ticket' , ticketSchema);