const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/campusConnect")
.then(() => console.log("Found Connected"))
.catch(err => console.log(err));

const foundSchema = mongoose.Schema({
    itemname: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    found_location: {
        type: String,
        required: true
    },

    date: {type: Date, default: Date.now }

});


module.exports = mongoose.model('Found', foundSchema);