const mongoose = require('mongoose')

const unmatchedbetsschema = new mongoose.Schema({
    contestId:{type:String,required:true},
    userId:{type:String,required:true},
})

module.exports = mongoose.model('Unmatchedbets',unmatchedbetsschema)