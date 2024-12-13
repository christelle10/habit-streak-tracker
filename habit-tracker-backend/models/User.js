const mongoose = require('mongoose'); //imports the Mongoose library

const UserSchema = new mongoose.Schema({ //a new a new schema named UserSchema is created using mongoose.Schema()
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        default: null, //no token is set for now
    },
    tokenExpiration: {
        type: Date, 
        default: null,
    },
    resetPassToken: {
        type: String,
        default: null,
    },
    resetPassTokenExpiration: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('User', UserSchema);
