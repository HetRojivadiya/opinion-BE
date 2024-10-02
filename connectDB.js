const mongoose = require('mongoose')

const connectionDB = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB connected`)
    }catch(err)
    {
        console.log(err.message)
        process.exit();
    }
}

module.exports = connectionDB

