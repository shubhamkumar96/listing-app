const express = require('express')
const Area = require('../models/area')

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
    } catch (error) {
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
        // res.redirect(`areas/${newArea.id}`)
        res.redirect(`areas`)
    } catch (error) {
        res.render('areas/new', {
            area: area,
            errorMessage: 'Error Creating Area- ' + error
        })
    }
})

module.exports = router