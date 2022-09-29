const mongoose = require('mongoose')

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
        type: Buffer,
        required: true
    },
    images: [{
        type: Buffer,
    }],
    profilePhotoType: {
        type: String,
        required: true
    },
    mobileNumber: {
        type: String,
        required: true
    },
    listingStatus: {
        type: String,
        required: true,
        default: false
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
    if(this.profilePhoto != null && this.profilePhotoType != null) {
        return `data:${this.profilePhotoType};charset=utf-8;base64,${this.profilePhoto.toString('base64')}`
    }
})

module.exports = mongoose.model('Worker', workerSchema)