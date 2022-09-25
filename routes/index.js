const express = require('express')
const Worker = require('../models/worker')

const router = express.Router()

router.get('/', async (req, res) => {
    let workers
    try {
        workers = await Worker.find().populate('area').sort({ createdAt: 'desc' }).limit(10).exec()
    } catch {
        workers = []
    }
    res.render('index', {workers: workers})
})

module.exports = router