const mongoose = require('mongoose');

const busSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    registrationNumber : {type:String, required:true , unique : true},
    numberOfSeats : {type:Number , required:true},
    otherDetails : {type:String , default : 'Source : null , Destination : null '}    
});

module.exports = mongoose.model('Bus' , busSchema);