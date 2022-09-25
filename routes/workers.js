const express = require('express')

const Area = require('../models/area')
const Worker = require('../models/worker')

const router = express.Router()

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// All Workers Route
router.get('/', async (req, res) => {
    let query = Worker.find();
    if(req.query.name != null && req.query.name !== '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
    }
    if(req.query.workType != null && req.query.workType !== '') {
        query = query.regex('workType', new RegExp(req.query.workType, 'i'))
    }
    if(req.query.gender != null && req.query.gender !== '') {
        query = query.regex('gender', new RegExp(req.query.gender, 'i'))
    }
    try {
        const workers = await query.exec()
        res.render('workers/index', {
            workers: workers,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Worker Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Worker())
})

// Create Worker Route
router.post('/', async (req, res) => {
    const worker = new Worker ({
        name: req.body.name,
        description: req.body.description,
        workType: req.body.workType,
        gender: req.body.gender,
        mobileNumber: req.body.mobileNumber,
        area: req.body.area
    })

    saveProfilePhoto(worker, req.body.profilePhoto)

    try {
        const newWorker = await worker.save()
        // res.redirect(`workers/${newWorker.id}`)
        res.redirect(`workers`)
    } catch {
        renderNewPage(res, worker, true) 
    }
})

function saveProfilePhoto(worker, profilePhotoEncoded) {
    if (profilePhotoEncoded == null) {
        return
    }
    const profilePhoto = JSON.parse(profilePhotoEncoded)
    if(profilePhoto != null && imageMimeTypes.includes(profilePhoto.type)) {
        worker.profilePhoto = new Buffer.from(profilePhoto.data, 'base64')
        worker.profilePhotoType = profilePhoto.type
    }
}

async function renderNewPage(res, worker, hasError = false) {
    try {
        const areas = await Area.find({})
        const params = {
            areas: areas,
            worker: worker
        }
        if (hasError) {
            params.errorMessage = 'Error Creating Worker'
        }
        res.render('workers/new', params)
    } catch (error) {
        res.redirect('/workers')
    }
}


module.exports = router