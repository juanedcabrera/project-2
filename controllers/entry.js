const express = require('express')
const router = express.Router()
const db = require('../models')

// GET /entries -- INDEX route to show all the entries
router.get('/', async (req, res) => {
    res.send('hello everyone')
})
// GET /entries/new -- SHOW form to create a new entry

// POST /entries -- CREATE route to add a new entry

// GET /entries/:id -- SHOW route to display a single entry

// GET /entries/:id/edit -- SHOW form to edit an entry

// PUT /entries/:id -- UPDATE route to modify an entry

// export the router instance
module.exports = router