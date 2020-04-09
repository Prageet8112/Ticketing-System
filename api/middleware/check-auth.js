const jwt = require('jsonwebtoken');
const role = require('./role.js');

module.exports = (req , res, next) =>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            res.status(401).json({
                message : 'No Token Provided'
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY );

        console.log(role[decoded.role]);
        console.log(req.baseUrl);
        
        if(role[decoded.role].find(function(url){
            return url == req.baseUrl
        })
        )
        {
            
            req.userData = decoded;
            next();
        }
        else{
            return res.status(401).json({
                message : 'Auth Failed'
            });
        }
    }
    catch(error){
        return res.status(401).json({
            message : 'Auth Failed'
        }); 
    } 
};