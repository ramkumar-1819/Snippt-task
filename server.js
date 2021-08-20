//Importing all the required packages
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const path=require('path');
const env=require('dotenv');

const app=express();
env.config()
const port=process.env.PORT || 8080;
//DB Connection
const {mongoose}=require('./DB/connection');
//Handling CORS

var allowedOrigin = ['http://localhost:3000','http://localhost:8080','https://snippet-schedular.herokuapp.com' /** other domains if any */ ]
var corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (allowedOrigin.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json())

//Getting Routes
const userRoute=require('./Routes/UserRoute');
const scheduleRoute=require('./Routes/ScheduleRoute');
//Handling Requests
app.use('/',userRoute)
app.use('/',scheduleRoute)

if(process.env.NODE_ENV=='production'){
  app.use(express.static('client/build'));
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'));
  })
}

app.listen(port,()=>console.log(`Server Started at Port ${port}`))