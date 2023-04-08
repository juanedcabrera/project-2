const express = require("express");
const router = express.Router();
const db = require("../models");
const cryptoJs = require('crypto-js')

// GET /entries/new -- SHOW form to create a new entry
router.get("/new", (req, res) => {
  res.render("entries/new.ejs");
});

// POST /entries -- CREATE route to add a new entry
router.post("/", async (req, res) => {
  try {
    const title = req.body.title;
    const content = req.body.content;
    const tags = req.body.tags;

    const decryptedPk = cryptoJs.AES.decrypt(
      req.cookies.userId,
      process.env.ENC_KEY
    );
    const decryptedPkString = decryptedPk.toString(cryptoJs.enc.Utf8);
    const user = await db.user.findByPk(decryptedPkString);

    const newEntry = await db.entry.create({
      title: title,
      content: content,
      userId: user.id,
    });

    if (tags) {
      const tagNames = [];

      // If the "happy" tag is checked, add it to the tagNames array
      if (tags.includes("happy")) {
        tagNames.push("happy");
      }

      // If the "sad" tag is checked, add it to the tagNames array
      if (tags.includes("sad")) {
        tagNames.push("sad");
      }

      // If the "confident" tag is checked, add it to the tagNames array
      if (tags.includes("confident")) {
        tagNames.push("confident");
      }

      // Find or create tags and associate them with the new entry
      const tagInstances = await Promise.all(
        tagNames.map((tagName) =>
          db.tag.findOrCreate({ where: { name: tagName } })
        )
      );
      await newEntry.addTags(tagInstances.map((tag) => tag[0]));
    }

    res.redirect("/entries");
  } catch (err) {
    console.log(err);
    res.redirect("/");
  } finally {
    console.log('hello')
  }
});

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
module.exports = router;
