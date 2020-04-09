const Bus = require('../models/bus');
const Ticket = require('../models/ticket');
const mongoose = require('mongoose');
const _ = require('underscore');

exports.buses_get_all = (req,res,next) => {
    Bus.find()
    .exec()
    .then(result => {
        const response = {
            numberOfBuses : result.length,
            buses: result.map(result =>{
                return {
                    registrationNumber : result.registrationNumber,
                    seats : result.numberOfSeats,
                    _id : result._id,
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/buses/' + result.registrationNumber
                    }
                }
            })
        }
        if(result.length>=0){
            res.status(200).json(response);
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}

exports.buses_get_bus_details = (req,res,next)=>{
    const busId = req.params.busId;
    const status = req.query.status;
    console.log(status + " " + busId);
    if(!status){
        Bus.findOne({registrationNumber:busId})
        .select('_id registrationNumber numberOfSeats otherDetails')
        .exec()
        .then(result =>{
            console.log(result);
            if(result){
                console.log("Found in DataBase : " + result);
                res.status(200).json(result);
            }
            else{
                res.status(404).json({
                    message : "No Bus With this BusId can be found. Check the BusId. "
                })
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(200).json({error:err});
        });
    }
    else if(status=='OPEN'){
        var occupied ;
        Bus.findOne({registrationNumber : busId})
        .exec()
        .then(result=>{
            if(result){
                
                occupied = _.range(result.numberOfSeats);  
                return Ticket.find({busNumber:busId,currentStatus:'CLOSED'}).exec()    
            }
            return res.status(404).json({
                message:'Bus Not Found'
            })
        })
        .then(result=>{
            if(result.length>=0){
                var c = 1;
                result.forEach(element => {
                    occupied.splice(element['seatNumber']-c,1);
                    c++;
                });
                //  console.log(occupied);
            res.status(200).json({
                busNumber : busId,
                seatAvailable : occupied.map( function(value) { return value + 1; })
                });
            }
            
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            })
        });
    }
    else if (status == 'CLOSED'){
        Ticket.find({currentStatus:'CLOSED',busNumber:busId})
        .exec()
        .then(result => {
            const response = {
                numberOfTickets : result.length,
                tickets: result.map(result =>{
                    return {
                        _id : result._id,
                        seatNumber : result.seatNumber,
                        busNumber : result.busNumber,
                        name : result.name , 
                        age : result.age,
                        currentStatus : result.currentStatus,
                        request : {
                            type : 'GET',
                            url : 'http://localhost:3000/tickets/' + result._id
                        }
                    }
                })
            }
            if(result.length>=0){
                res.status(200).json(response);
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });   
        });        
    }
    else{
        res.status(500).json({
            message : " Invalid API. Check status code(MUST BE IN CAPS)."
        });
    }
}

exports.buses_add_new_bus = (req,res,next) => {
    console.log(req.registrationNumber);
    const bus = new Bus({
        _id : new mongoose.Types.ObjectId,
        registrationNumber: req.body.registrationNumber,
        numberOfSeats : req.body.numberOfSeats,
        otherDetails : req.body.otherDetails
    })
    bus.save()
    .then(result =>{
        console.log(bus);
        res.status(200).json({
            message : 'Bus Registered Successfully',
            busDetails : {
                _id : result._id,
                registrationNumber : result.registrationNumber,
                seats : result.seats,
                request : {
                    type : 'GET',
                    url : 'http://localhost:3000/buses/' + result._id
                }
            }
        })

    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}

exports.buses_delete_bus = (req,res,next) => {
    const busId = req.params.registrationNumber;

    Bus.findOneAndRemove({registrationNumber:busId})
    .exec()
    .then(result =>{
        if(result){
            console.log("In Delte many");
            return Ticket.deleteMany({busNumber:busId}).exec();
        }
        return res.status(404).json({
                error:"BUS NOT FOUND"
            })
    })
    .then(result =>{
        res.status(200).json({
            message : "Bus Removed Successfully"
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(200).json({
            error: err
        })
    });
}