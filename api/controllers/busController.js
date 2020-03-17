const Bus = require('../models/bus');
const mongoose = require('mongoose');

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

exports.buses_get_bus_by_id = (req,res,next) => {
    const busId = req.params.registrationNumber;
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
    const BusId = req.params.registrationNumber;
    Bus.remove({registrationNumber:BusId})
    .exec()
    .then(result =>{
        res.status(200).json({
            message : "Bus Removed Successfully"
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(200).json({
            error:err,
            message : 'Invalid API'
        })
    });
}