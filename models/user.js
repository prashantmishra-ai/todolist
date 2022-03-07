const mongoose = require('mongoose')
const userdetail = new mongoose.Schema({
    personname : {
        type: String,
        required : [true, "Name can't be Blank"]
    },
    username : {
        type: String,
        required : [true, "Username can't be Blank"]
    },
    password : {
            type: String,
            required : [true, "Password can't be Blank"]
    },
    taskname : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todolist'
    }
})

module.exports = mongoose.model('user', userdetail )