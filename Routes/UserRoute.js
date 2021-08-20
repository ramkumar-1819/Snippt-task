//Creating the Routes for Users
const {User}=require('../Models/User');
const router=require('express').Router();
const jwt=require('jsonwebtoken');

//Signup - used to create users [student1,student2,faculty].
router.post('/Signup',async(req,res)=>{
    try{
        const docs=await User.findOne({email:req.body.email});
        if(docs!==null){
            return res.status(409).send(`User already Exist`)
        }
        else{
            const newUser=await new User(req.body)
            const docs=await newUser.save()
            return res.status(200).send(docs)
        }
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
//Signin - If user found return JSON token
router.post('/Signin',async(req,res)=>{
    try{
        const docs=await User.findOne({email:req.body.email,type:req.body.type});
        if(docs===null){
            return res.status(409).send(`User not Exist`)
        }
        if(await docs.validatePassword(req.body.password)){
            const token=jwt.sign(req.body,process.env.SECRET);
            return res.send({token:token,user:docs._id});
        }
        else{
            return res.status(409).send("Incorrect Password")
        }
    }
    catch(err){
            res.status(409).send('error')
    }
})
module.exports=router