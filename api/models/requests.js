const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    desc: {
        type: String,

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    doner: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

    }],


    date: {
        type: Date,


    },
    status: {
        type: String,
        enum: ["Pindding", "Accepted", "Rejected"],
        default: "Pindding"
    },
    img: [{
        type: String,
        default: "https://icon-icons.com/icons2/582/PNG/512/worker_icon-icons.com_55029.png"
    }],


    creationDate: {
        type: Date,
        default: new Date
    }

});

module.exports = mongoose.model('request', requestSchema);