const express  = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const ticketRoutes = require('./api/routes/tickets');
const busesRoutes = require('./api/routes/buses');
const usersRoutes = require('./api/routes/users');

mongoose.connect('mongodb+srv://ticket-app:' + process.env.MONGO_ATLAS_PW + 
'@ticket-app-mbgne.mongodb.net/test?retryWrites=true&w=majority',
{
    useNewUrlParser : true,
    useUnifiedTopology:true
}
);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());
app.use((res,req,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers',
    'Origin,X-Reqeuested-With,Content-Type,Accept,Authorization');

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        res.status(200).json({});
    }
    next();
});

app.use('/users',usersRoutes);
app.use('/buses', busesRoutes);
app.use('/tickets',ticketRoutes);

app.use((req,res,next) => {
    const error = new Error('API Not Found')
    error.status = 404;
    next(error);
});

app.use((error , req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message : error.message
        }
    });
});

module.exports = app;   