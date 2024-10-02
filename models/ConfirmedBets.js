const mongoose = require('mongoose')

const confirmedbetsschema = new mongoose.Schema({
    title:{type: String,required: true},
    contestId:{type:String,required:true},
    yesUserId:{type:String,required:true},
    noUserId:{type:String,required:true},
    yesPrice:{type:Number,required:true},
    noPrice:{type:Number,required:true}
})

module.exports = mongoose.model('ConfirmedBets',confirmedbetsschema)