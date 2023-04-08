const express = require('express')
const router = express.Router()
const db = require('../models')


// GET /entries/new -- SHOW form to create a new entry
router.get('/new', (req, res) => {
    res.render('entries/new.ejs')
})
// POST /entries -- CREATE route to add a new entry

// GET /entries -- INDEX route to show all the entries
// router.get('/', async (req, res) => {
//     try {
//         const entries = await db.entry.findAll()
//         res.render('entries/index.ejs', { entries})
//     } catch (err) {
//         console.log(err)
//         res.redirect('/')
//     }
// })

// GET /entries/:id -- SHOW route to display a single entry

// GET /entries/:id/edit -- SHOW form to edit an entry

// PUT /entries/:id -- UPDATE route to modify an entry

// export the router instance
module.exports = router