// required packages
require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cryptoJs = require('crypto-js')
const db = require('./models')

// app config
const app = express()
const PORT = process.env.PORT || 8000
app.set('view engine', 'ejs')

// middlewares
// parse html from request bodies
app.use(express.urlencoded({ extended: false }))
// tells express to parse incoming cookings sent from the browser
app.use(cookieParser())
app.use((req, res, next) => {
    // incoming request console logger
    console.log(`[${new Date().toLocaleString()}]: ${req.method} ${req.url}`)
    console.log('request body:', req.body)
    // send data downstream to the other routes
    // res.locals.myData = 'hi 👋'
    next() // tells express that this middleware has finished
})

// routes and controllers
app.get('/', (req, res) => {
    const user = res.locals.user
    console.log(res.locals)
    res.render("index.ejs", { user })
})

// middleware for authenticated routes
const requireAuth = async (req, res, next) => {
    try {
        // check if there is a cookie
        if (req.cookies.userId) {
            // if so we will decrypt the cookie and lookup the user using their PK
            const decryptedPk = cryptoJs.AES.decrypt(req.cookies.userId, process.env.ENC_KEY)
            const decryptedPkString = decryptedPk.toString(cryptoJs.enc.Utf8)
            const user = await db.user.findByPk(decryptedPkString) // eager loading can be done here
            // mount the found user on the res.locals
            // in all other routes you can assume that the res.locals.user is the currently logged in user
            res.locals.user = user
            next() // go to the next thing no matter what
        } else {
            // if there is no cookie, set return an authorized error
            return res.render('unauthorized.ejs')
        }
    } catch (error) {
        console.log(error)
        // if something goes wrong
        // give unauthorized error
        return res.render('unauthorized.ejs')
    } 
};

app.use('/users', require('./controllers/users.js'))
app.use('/entries', requireAuth, require('./controllers/entry.js'))

// listen a port
app.listen(PORT, () => {
    console.log(`authenticating users on port ${PORT}`)
})