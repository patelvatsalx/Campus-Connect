const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/campusConnect")
.then(() => console.log("Lost Connected"))
.catch(err => console.log(err));

const lostSchema = mongoose.Schema({
    itemname: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    lost_location: {
        type: String,
        required: true
    },

    date: {type: Date, default: Date.now }

});


module.exports = mongoose.model('Lost', lostSchema);