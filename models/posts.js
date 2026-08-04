const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/campusConnect")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true 
    },
    content:{
        type: String,
        required: true 
    }
},{timestamps: true})
module.exports = mongoose.model("Post", postSchema)