const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'request',
    },

    img: {
        type: String,
        default: "https://icon-icons.com/icons2/582/PNG/512/worker_icon-icons.com_55029.png"
    },


    creationDate: {
        type: Date,
        default: new Date
    }

});

module.exports = mongoose.model('request', requestSchema);