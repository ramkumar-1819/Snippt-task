const {Schedule}=require('../Models/Schedules');
const router=require('express').Router();
const ObjectId=require('mongoose').Types.ObjectId;

//getStudentSchedule - return the particular student schedules.
router.post('/getStudentSchedule',async(req,res)=>{
    try{
        const studentSchedules=await Schedule.find({student:req.body.student})
        res.send(studentSchedules)
    }
    catch(err){
        res.sendStatus(500)
    }
})
//allStudent - return all the requested and confirmed schedules of students.
router.get('/allSchedule',async(req,res)=>{
    try{
        const allSchedules=await Schedule.find({Status:{$in:['Pending','Confirmed']}}).populate('student').sort({Date:'asc'})
        const schedules=[]
        for (let meet of allSchedules){
            if(new Date(new Date(meet.Date).getTime()+ 18.5 * 60 * 60 * 1000).getTime()>new Date().getTime()){
                schedules.push(meet)
            }
        }
        res.send(schedules)
    }
    catch(err){
        res.sendStatus(500)
    }
})
//Schedule - Create a new Schedule and if there is some rejected schedule then it get deleted and 
//the schedules requested or confirmed date is less than today's date then it too get deleted
router.post('/Schedule',async(req,res)=>{
    try{
        const existingSchedules=await Schedule.find({student:req.body.student})
        for(let meet of existingSchedules){
            if(meet.Status==='Rejected'){
                await Schedule.findByIdAndRemove(meet._id)
            }
            else if(new Date(new Date(meet.Date).getTime()+ 18.5 * 60 * 60 * 1000).getTime()<new Date().getTime()){
                await Schedule.findByIdAndRemove(meet._id)
            }
        }
        for(let meet of existingSchedules){
            if(meet.Date===req.body.Date && meet.Slot===req.body.Slot && meet.Status!=='Rejected'){
                return res.status(409).send('You haved already Scheduled a meeting in this Date and Slot')
            }
        }
        const newSchedule=await new Schedule(req.body)
        const docs=await newSchedule.save()
        return res.status(200).send(docs)
    }
    catch(err){
        console.log(err.message)
        if(err.name==="ValidationError"){
            res.status(409).send(err.message)
        }
        else{
            res.sendStatus(500)
        }
    }
})
//modifySchedule - determine the requested schedule is accepted or rejected by faculty.
router.patch('/modifySchedule/:id',async(req,res)=>{
    try{
        const updatedSchedule=await Schedule.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true}).populate('student')
        res.send(updatedSchedule)
    }
    catch(err){
        console.log(err)
        res.sendStatus(500)
    }
})
module.exports=router;