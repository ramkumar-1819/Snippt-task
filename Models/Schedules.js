const mongoose=require('mongoose'),Schema=mongoose.Schema;

//Defining the Schema
const scheduleSchema=new Schema({
    student:{type:Schema.Types.ObjectId,ref:'User',required:true},
    Date:{type:String,required:true},
    Slot:{type:String,required:true},
    Status:{type:String,default:'Pending'}
})
//Creating a model
const Schedule=mongoose.model('Schedules',scheduleSchema)
module.exports={Schedule};
