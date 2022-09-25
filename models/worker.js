const mongoose = require('mongoose')
const path = require('path')

const profileImageBasePath = 'uploads/profilePhotos'

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    gender: {
        type: String,
        required: true
    },
    workType: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    area: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Area'
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

workerSchema.virtual('profileImagePath').get(function() {
    if(this.profilePhoto != null) {
        return path.join('/', profileImageBasePath, this.profilePhoto)
    }
})

module.exports = mongoose.model('Worker', workerSchema)
module.exports.profileImageBasePath = profileImageBasePath