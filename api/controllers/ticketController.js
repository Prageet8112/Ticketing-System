const mongoose = require('mongoose');
const _ = require('underscore');

const Bus = require('../models/bus');
const Ticket = require('../models/ticket');

exports.tickets_get_all_closed_tickets = (req,res,next) =>{
    const busId = req.params.busNumber;
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

exports.tickets_get_ticket_details = (req,res,next) => {
    const id = req.params.ticketId;
    Ticket.findById(id)
    .exec()
    .then(result => {
        if(!result){
            res.status(404).json({
                message : "Ticket not Found"
            })
        }
        res.status(200).json({
            name : result.name,
            age  : result.age,
            currentStatus : result.currentStatus,
            _id : id
        })
        
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
}

exports.tickets_create_ticket = (req,res,next) => {
    const busNumber = req.body.busNumber;
    const seatNumber = req.body.seatNumber;
    console.log(busNumber);
    Bus.findOne({registrationNumber : busNumber})
    .exec()
    .then(
        result =>{
        if(!result){
            return res.status(404).json({
                error :'Bus cannot be found'
            });
        }
        if(req.body.currentStatus){
            return res.status(500).json({
                error : "Cannot send currentStatus with ticket body" 
            });
        }
        if(req.body.seatNumber<1 || req.body.seatNumber >result.numberOfSeats){
            return res.status(500).json({
                error : "Invalid Seat No" 
            });
        }
        return Ticket.findOne({busNumber:busNumber , seatNumber:seatNumber}).exec();
    })   
    .then(
        result =>{
            console.log(result);
            if(!result){
                const ticket = new Ticket({
                        _id : new mongoose.Types.ObjectId(),
                        busNumber : busNumber,
                        seatNumber : seatNumber,
                        name : req.body.name,
                        age : req.body.age ,
                        currentStatus : 'CLOSED'
                    })
                    return ticket.save()
            }
            return res.status(201).json({
                error : 'Seat Occupied'
            })
        })
    .then(result =>{
        console.log(result);
        res.status(200).json({
            message : "Ticket Issued ",
            ticket : {
                busNumber : result.busNumber,
                seatNumber : result.seatNumber,
                name : result.name,
                age : result.age,
                currentStatus : result.currentStatus
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            message : 'Ticket Not Issued ',
            error : err
        })
    });


}

exports.tickets_open_all_tickets_of_bus= (req,res,next) => {
    const regNumber = req.params.busId;
    // console.log(regNumber);
    Bus.findOne({registrationNumber :regNumber})
    .exec()
    .then(result =>{
        if(!result){
          return  res.status(404).json({
                message : 'Bus not found. Cannot change status'
            });
        }
        return Ticket.deleteMany({busNumber:regNumber});
    })
    .then(result => {
        console.log("in sec hen" + result);
        res.status(200).json({
            message : 'All Tickets are Open for BUS : ' + regNumber
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
}

exports.tickets_get_all_open_tickets= (req,res,next)=>{
    const busId = req.params.busNumber;
    var occupied ;
    Bus.findOne({registrationNumber : busId})
    .exec()
    .then(result=>{
        if(result){
            occupied = _.range(result.numberOfSeats);
            return Ticket.find({currentStatus:'CLOSED',busNumber:busId}).exec()    
        }
        return res.status(404).json({
            message:'Bus Not Found'
        })
    })
    .then(result=>{
        if(result.length>0){
            result.forEach(element => {
                occupied.splice(element['seatNumber']-1,1);
                
            });

        res.status(200).json({
            busNumber : busId,
            seatAvailable : occupied.map( function(value) { return value + 1; }).toString()
            });
        }

        res.status(200).json({
            message : 'No tickets Booked for this Bus'
        });
        
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    });
}

exports.tickets_update_status_of_ticket=(req,res,next) =>{
    const busNumber = req.body.busNumber;
    const seatNumber= req.body.seatNumber;
    Ticket.findOne({busNumber:busNumber , seatNumber :seatNumber})
    .exec()
    .then(result =>{
        if(!result){
            res.status(404).json({
                message : 'Invalid Bus Number or Seat Number'
            })
        }
        return Ticket.findOneAndRemove({busNumber:busNumber , seatNumber :seatNumber}).exec();
    })
    .then(result =>{
        res.status(200).json({
            message : "Ticket Removed Successfully" ,
        })
    })
    .catch( err =>{ 
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
}