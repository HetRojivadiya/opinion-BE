const mongoose = require('mongoose')

const balanceSchema = new mongoose.Schema({
    userId:{type:String,required:true},
    balance:{type:Number,required:true},
})

module.exports = mongoose.model('Balance',balanceSchema)