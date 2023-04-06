// required packages
require('dotenv').config()
const express = require('express')

// app config

const app = express()
const PORT = process.env.PORT || 8000
app.set('view engine', 'ejs')


// middlewares
// parse html from request bodies
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
// routes and controllers
app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.use('/users', require('./controllers/users.js'))

// listen a port
app.listen(PORT, () => {
    console.log(`port is ${PORT}`)
})