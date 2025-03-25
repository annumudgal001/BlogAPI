const mongoose = require('mongoose');

const schema=mongoose.Schema;
const postschema=new schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt:{
        type:Date,
        default:Date.now
    }
})


module.exports=mongoose.model("post",postschema)