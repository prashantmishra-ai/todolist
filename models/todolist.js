const mongoose = require('mongoose')
const todolistschema = new mongoose.Schema({
    taskname : String,
    taskdays : Number,
    taskdescription : String,
    taskdate : Date,
    taskby:    {
            type: mongoose.Schema.Types.ObjectId,
            ref : "user"
    }
})

module.exports = mongoose.model('TODOLIST', todolistschema)