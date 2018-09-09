module.exports=function ConnectMongoDB(){
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://don:don123@ds149732.mlab.com:49732/donation')
}

