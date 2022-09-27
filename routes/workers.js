const express = require('express')
const mongoose = require('mongoose')

const Area = require('../models/area')
const Worker = require('../models/worker')

const router = express.Router()

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

// All Workers Route
router.get('/', async (req, res) => {
    try {
        const areas = await Area.find({})
        let query = Worker.find().populate('area');
        if(req.query.name != null && req.query.name !== '') {
            query = query.regex('name', new RegExp(req.query.name, 'i'))
        }
        if(req.query.workType != null && req.query.workType !== '') {
            query = query.regex('workType', new RegExp(req.query.workType, 'i'))
        }
        if(req.query.gender != null && req.query.gender !== '') {
            query = query.regex('gender', req.query.gender)
        }
        // console.log(req.query.area, "1")
        // if(req.query.area != null && req.query.area !== '') {
        //     query = query.regex('area',new mongoose.Types.ObjectId(req.query.area))
        // }
        // console.log(query._conditions, "2")
        const workers = await query.exec()
        res.render('workers/index', {
            workers: workers,
            areas: areas,
            searchOptions: req.query
        })
    } catch (err) {
        console.error(err)
        res.redirect('/')
    }
})

// New Worker Route
router.get('/new', async (req, res) => {
    renderFormPage(res, new Worker(), "new")
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
        res.redirect(`workers/${newWorker.id}`)
    } catch {
        renderFormPage(res, worker, "new", true) 
    }
})

//  Show Worker Route
 router.get('/:id', async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id).populate('area').exec()
        res.render('workers/show', { worker: worker })
    } catch {
        res.redirect('/')
    }
 })

 //  Edit Worker Route
 router.get('/:id/edit', async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id)
        renderFormPage(res, worker, "edit")
    } catch {
        res.redirect('/')
    }
 })

 // Update Worker Route
router.put('/:id', async (req, res) => {
    let worker

    try {
        worker = await Worker.findById(req.params.id)
        worker.name = req.body.name
        worker.description = req.body.description
        worker.workType = req.body.workType
        worker.gender = req.body.gender
        worker.mobileNumber = req.body.mobileNumber
        worker.name = req.body.name
        worker.area = req.body.area
        if (req.body.profilePhoto != null && req.body.profilePhoto !== '') {
            saveProfilePhoto(worker, req.body.profilePhoto)
        }
        await worker.save()
        res.redirect(`/workers`)
    } catch (err) {
        console.error(err)
        if (worker != null) {
            renderFormPage(res, worker, "edit", true) 
        } else {
            res.redirect('/')
        }
    }
})

//  Delete the Worker
router.delete('/:id', async (req, res) => {
    let worker
    try {
        worker = await Worker.findById(req.params.id)
        await worker.remove()
        res.redirect(`/workers`)
    } catch {
        if (worker != null) {
            res.render('books/show', {
                worker: worker,
                errorMessage: 'Could Not Remove Worker'
            })
        } else {
            res.redirect('/')
        }
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

async function renderFormPage(res, worker, form, hasError = false) {
    try {
        const areas = await Area.find({})
        const params = {
            areas: areas,
            worker: worker
        }
        if (hasError) {
            if(form === 'new') {
                params.errorMessage = 'Error Creating Worker'
            } else {
                params.errorMessage = 'Error Updating Worker'
            }
        }
        res.render(`workers/${form}`, params)
    } catch (error) {
        res.redirect('/workers')
    }
}

module.exports = router