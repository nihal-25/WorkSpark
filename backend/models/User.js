import mongoose from "mongoose";
const userSchema= new mongoose.Schema({
    name:{type:String,required:true},
    role:{type:String,required:true, enum: ["recruiter", "jobseeker"] },
    age: {type: Number,required: true,min: [18, "Age must be 18 or above"] },
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    lastSeenJob: { type: mongoose.Schema.Types.ObjectId, ref: "Job", default: null }, //included this so we can track whats the last jobcard the user saw
},{timestamps:true});

const User=mongoose.model("User",userSchema);

export default User;
