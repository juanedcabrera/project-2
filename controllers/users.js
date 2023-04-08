// required packages
const express = require('express')
const router = express.Router()
const db = require('../models')
const bcrypt = require('bcrypt')
const cryptoJs = require('crypto-js')

// GET /users/new -- show route for a form that creates a new user (sign up for the app)
router.get('/new', (req, res) => {
    res.render('users/new.ejs')
})

// POST /users -- CREATE a new user from the form @ GET /users/new
router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        // do a find or create with the user's given email
        const [newUser, created] = await db.user.findOrCreate({
            where: {
                email: req.body.email
            }
        })
        if (!created) {
            // if the user's returns as found -- don't let them sign up
            console.log('user account exists')
            // instead redirect them to the log in page
            res.redirect('/users/login?message=Please login to your account to continue 🙈')
        } else {
            // hash the users's password before we add it to the db
            const hashedPassed = bcrypt.hashSync(req.body.password, 12)
            // save the user in the db
            newUser.password = hashedPassed
            await newUser.save()
            // encypt the logged in user's id
            const encryptedPk = cryptoJs.AES.encrypt(newUser.id.toString(), process.env.ENC_KEY)
            // set encrypted id as a cookie
            res.cookie('userId', encryptedPk.toString())
            // redirect user 
            res.redirect('/users/profile')
        }
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// GET /users/login -- show route for a form that lets a user login
router.get('/login', (req, res) => {
    console.log(req.query)
    res.render('users/login.ejs', {
        message: req.query.message ? req.query.message : null
    })
})

// POST /users/login -- authenticate a user's credentials
router.post('/login', async (req, res) => {
    try {
        console.log(req.body)
        // search for the user's email in the db
        const foundUser = await db.user.findOne({
            where: {
                email: req.body.email
            }
        })
        const failedLoginMessage = 'Incorrect email or password 🙁'
        if (!foundUser) {
            // if the user's email is not found -- do not let them login
            console.log('user not found')
            res.redirect('/users/login?message=' + failedLoginMessage)
        } else if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
            console.log('incorrect password')
            // if the user exists but they have the wrong password -- do not let them login
            res.redirect('/users/login?message=' + failedLoginMessage )
        } else {
            // if the user exists, they know the right password -- log them in
            const encryptedPk = cryptoJs.AES.encrypt(foundUser.id.toString(), process.env.ENC_KEY)
            // set encrypted id as a cookie
            res.cookie('userId', encryptedPk.toString())
            // redirect user 
            res.redirect('/users/profile')
        }
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

// GET /users/logout -- log out the current user
router.get('/logout', (req, res) => {
    console.log('logging user out!')
    res.clearCookie('userId')
    res.redirect('/')
})

// GET /users/profile -- show authorized users their profile page
router.get('/profile', (req, res) => {
    // if the user comes and is not logged -- they lack authorization
    if(!res.locals.user) {
        // redirect them ot the login
        res.redirect('/users/login?message=You are not authorized to view that page. Please authenticate to continue 😎')
    } else {
        // if they are allowed to be here, show them their profile
        res.render('users/profile.ejs')
    }
})

// export the router instance
module.exports = router