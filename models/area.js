const mongoose = require('mongoose')
const Worker = require('./worker')

const areaSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

areaSchema.pre('remove', function(next) {
    Worker.find({ area: this.id}, (err, workers) => {
        if (err) {
            next(err)
        } else if (workers.length > 0) {
            next(new Error('This area has some workers present'))
        } else {
            next()
        }
    })
})


module.exports = mongoose.model('Area', areaSchema)