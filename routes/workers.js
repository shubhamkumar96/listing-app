const express = require('express')
const multer = require('multer')

const path = require('path')
const fs = require('fs')

const Area = require('../models/area')
const Worker = require('../models/worker')

const router = express.Router()

const uploadPath = path.join('public', Worker.profileImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// All Workers Route
router.get('/', async (req, res) => {
    let query = Worker.find();
    if(req.query.name != null && req.query.name !== '') {
        query = query.regex('name', new RegExp(req.query.name, 'i'))
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
router.post('/', upload.single('profilePhoto'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const worker = new Worker ({
        name: req.body.name,
        description: req.body.description,
        workType: req.body.workType,
        gender: req.body.gender,
        profilePhoto: fileName,
        mobileNumber: req.body.mobileNumber,
        area: req.body.area
    })


    try {
        const newWorker = await worker.save()
        // res.redirect(`workers/${newWorker.id}`)
        res.redirect(`workers`)
    } catch {
        if (worker.profilePhoto != null) {
            removeProfilePhoto(worker.profilePhoto)
        }
        renderNewPage(res, worker, true) 
    }
})

function removeProfilePhoto(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) {
            console.error(err)
        }
    })
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