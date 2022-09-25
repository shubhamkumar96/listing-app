if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
    // console.log(process.env)
}

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()

const indexRouter = require('./routes/index')
const areaRouter = require('./routes/areas')
const workerRouter = require('./routes/workers')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

// Connecting to MongoDB 
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/areas', areaRouter)
app.use('/workers', workerRouter)

app.listen(process.env.PORT || 3003)