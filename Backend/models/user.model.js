import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username :{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        // unique:true,
    },
    resetOtp: {
    type: String
},
resetOtpExpiry: {
    type: Date
},
isPremium: {
        type: Boolean,
        default: false
    }

})

const User = mongoose.model("User",userSchema);
export default User;