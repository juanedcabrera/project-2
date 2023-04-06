const express = require ('express')
const router = express.Router()

// GET /users/new -- show route for a form that creates a new user () like (sign up for the app)
router.get('/new', (req, res) =>{
    res.render('users/new.ejs')
})


// POST /users -- CREATE a new user from the form @ GET /users/new
router.post('/', (req, res) => {
    res.send('creat a new user, log a user in')
    // do a find or create with the user's given email
        // if the user's returns as found -- don't let them sign up
        // instead redirect them to the logging page
        // save the user in the db
        // encrypt the logged in user id
        // set encrypted id as a cookie
        // redirect user
})

// GET /users/login -- show route for a form that lets a user login 
router.get('/login', (req, res) => {
    res.send('show a form')
})

// POST /users/login -- authenticate a user's credentials
router.post('/login', (req, res) => {
    res.send('verify credentials')
})


// GET /users/logout -- log out the current user
router.get('/logout', (req, res) => {
    res.send('log user out')
})


// GET /users/profile -- show authorized users their profile page
router.get('/profile', (req, res) => {
    res.send('show currently logged in user')
})


module.exports = router