const express = require('express')
const Area = require('../models/area')
const Worker = require('../models/worker')

const router = express.Router()

// All Areas Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const areas = await Area.find(searchOptions)
        res.render('areas/index', {
            areas: areas,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Area Route
router.get('/new', (req, res) => {
    res.render('areas/new', { area: new Area() })
})

// Create Area Route
router.post('/', async (req, res) => {
    const area = new Area({
        name: req.body.name
    })

    try {
        const newArea = await area.save()
        res.redirect(`areas/${newArea.id}`)
    } catch {
        res.render('areas/new', {
            area: area,
            errorMessage: 'Error Creating Area'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const area = await Area.findById(req.params.id)
        const workersByArea = await Worker.find({ area: area.id, listingStatus: 'true'}).limit(20).exec()
        res.render('areas/show', {
            area: area,
            workersByArea: workersByArea
        })
    } catch {
        res.redirect(`/`)
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const area = await Area.findById(req.params.id)
        res.render('areas/edit', { area: area })
    } catch (error) {
        res.redirect(`areas`)
    }
})

router.put('/:id', async (req, res) => {
    let area
    try {
        area = await Area.findById(req.params.id)
        area.name = req.body.name
        await area.save()
        res.redirect(`/areas/${area.id}`)
    } catch {
        if (area == null) {
            res.redirect('/')
        } else {
            res.render('areas/edit', {
                area: area,
                errorMessage: 'Error Creating Area'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let area
    try {
        area = await Area.findById(req.params.id)
        await area.remove()
        res.redirect(`/areas`)
    } catch {
        if (area == null) {
            res.redirect('/')
        } else {
            res.redirect(`/areas/${area.id}`)
        }
    }
})

module.exports = router