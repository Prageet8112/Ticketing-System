const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.users_user_signup = (req,res,next) => {
    User.find({email:req.body.email})
    .exec()
    .then(user => {
        if(user.length >=1 ){
            return  res.status(500).json({
                message:"Mail Exists"
            })
        }
        else{
            bcrypt.hash(req.body.password , 10 , (err,hash)=> {
                if(err){
                    return res.status(500).json({
                        error:err
                    });
                }
                else{
                const user = new User({
                    _id :new mongoose.Types.ObjectId(),
                    email : req.body.email,
                    password: hash,
                    role : req.body.role
                    })
                    user.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message : "User Created"
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error:err
                        });
                    });
                }
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    });
}

exports.users_user_login = (req,res,next) => {
    User.find({email:req.body.email})
    .exec()
    .then(user => {
        if(user.length<1){
            return res.status(401).json({
                message:'Auth Failed'
            })
        }
        bcrypt.compare(req.body.password,user[0].password, (err,response) =>{
            if(err){
                return res.status(401).json({
                    message:'Auth Failed'
                });
            }
            if(response){
                const token = jwt.sign({
                    email: user[0].email,
                    _id : user[0]._id,
                    role : user[0].role
                },process.env.JWT_KEY,{expiresIn:"1h"});

                return res.status(200).json({
                    message:'Auth Successful',
                    token : token
                });
            }
            res.status(401).json({
                message : 'Auth Failed'
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        })
    });

}

exports.users_delete_user = (req,res,next) => {
    
    console.log(req.params.userId);

    User.findOneAndDelete({ email : req.params.email })
    .exec()
    .then(result => {
        res.status(200).json({
            message : "User deleted"
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error  : err
        });
    });
}