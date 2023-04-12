const express = require("express");
const router = express.Router();
const db = require("../models");
const cryptoJs = require("crypto-js");
const methodOverride = require('method-override');
const { Op, Sequelize } = require('sequelize');
const adjectives = [
  "Accomplishment",
  "Adventure",
  "Comfort",
  "Contentment",
  "Creativity",
  "Empowered",
  "Excitement",
  "Family",
  "Friendship",
  "Gracious",
  "Grateful",
  "Growth",
  "Health",
  "Hopeful",
  "Inspired",
  "Joyful",
  "Learning",
  "Love",
  "Mindfulness",
  "Nature",
  "Nostalgic",
  "Overwhelmed",
  "Peaceful",
  "Positivity",
  "Reflection",
  "Relationships",
  "Sadded",
  "Spiritual",
  "Success"
];

// GET /entries -- INDEX route to show all the entries
router.get("/", async (req, res) => {
  try {
    const { word, tag, date } = req.query;
    const searchOptions = {
      where: {
        userId: res.locals.user.id,
      },
      order: [
        ['id', 'DESC']
      ]
    };
    if (tag) {
      searchOptions.include = [
        {
          model: db.tag,
          where: {
            name: tag
          }
        }
      ];
    }
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      searchOptions.where.createdAt = {
      [Op.between]: [startDate, endDate]
      }
    }

    if (word) {
      searchOptions.where.content = {
        [Op.and]: [
          Sequelize.where(
            Sequelize.cast(Sequelize.col('content'), 'text'),
            'ILIKE',
            `%${word}%`
          )
        ]
      };
    }

    const entries = await db.entry.findAll(searchOptions);
    res.render("entries/index.ejs", { entries });
  } catch (err) {
    console.log(err);
  }
});

// GET /entries/new -- SHOW form to create a new entry
router.get("/new", async (req, res) => {
  let quotes = [];
  const apiUrl = "https://api.themotivate365.com/stoic-quote";
  try {
    await fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        quotes = data;
      });
  } catch (err) {
    console.log(err);
  }
  
  const user = res.locals.user;
  res.render("entries/new.ejs", {
    user,
    quotes,
    adjectives: adjectives
  });
});

// router.get('/unauthorized') method
router.get("/unauthorized", function (req, res, next) {
  res.render("unauthorized", {
    user: req.user,
    partials: { header: "./partials/header" },
  });
});

// POST /entries -- CREATE route to add a new entry
router.post("/", async (req, res) => {
  try {
    const content = {
      content1: req.body.content1,
      content2: req.body.content2,
      content3: req.body.content3,
      content4: req.body.content4,
      content5: req.body.content5,
    };
    let tags = req.body.tags; // had to change to let for tags to work

    const decryptedPk = cryptoJs.AES.decrypt(
      req.cookies.userId,
      process.env.ENC_KEY
    );
    const decryptedPkString = decryptedPk.toString(cryptoJs.enc.Utf8);
    const user = await db.user.findByPk(decryptedPkString);

    const newEntry = await db.entry.create({
      userId: user.id,
      content: content,
    });

// tag logic
if (Array.isArray(tags) && tags.length > 0) {
  const tagLookups = tags.map(tagName => db.tag.findOne({ where: { name: tagName } }));
  const foundTags = await Promise.all(tagLookups);
  console.log('foundTags:', foundTags);
  const validTags = foundTags.filter(tag => tag !== null);
  console.log('validTags:', validTags);
  if (validTags.length > 0) {
    await newEntry.addTags(validTags);
  }
}


     res.redirect("/entries");
  } catch (err) {
    console.log(err);
    res.render("error");
  }
});


// GET /entries/:id -- SHOW route to display a single entry
router.get("/:id", async (req, res) => {
  try {
    const foundEntry = await db.entry.findAll({
      where: {
        // filter entry by current user logged in
        userId: res.locals.user.id,
        id: req.params.id,
      },
      include: [{
        model: db.tag,
        as: 'tags',
        attributes: ['name'],
        through: {
          attributes: []
        }
      }]
    });
    if (!foundEntry.length) {
      // Entry not found redirect to index
      return res.redirect("/entries?message=Entry not found");
    } else {
      // render show page for entry
      res.render("entries/show.ejs", {
        entry: foundEntry[0],
      });
    }
  } catch (err) {
    console.log(err);
    res.redirect("/entries?message=An error occured");
  }
});

// GET /entries/:id/edit -- SHOW form to edit an entry
router.get("/:id/edit", async (req, res) => {
  try {
    // Find the entry with the given ID
    const foundEntry = await db.entry.findAll({
      where: {
        // filter entry by current user logged in
        userId: res.locals.user.id,
        id: req.params.id,
      },
    });
    
    const adjectives = await db.entry_tag.findAll({
      where: {
        entryId: req.params.id,
    }
  });

    // Render the edit form with the entry data
    console.log(adjectives)
    res.render("entries/edit-entry", { entry: foundEntry[0], adjectives });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// PUT /entries/:id -- UPDATE route to modify an entry
router.put("/:id", async (req, res) => {
  try {
    // Find the entry with the given ID
    const foundEntry = await db.entry.findOne({
      where: {
        // filter entry by current user logged in
        userId: res.locals.user.id,
        id: req.params.id,
      },
    });

    // Entry not found - redirect to index
    if (!foundEntry) {
      res.redirect('/entries?message=Entry not found')
    }

    // Grouping all Content together for JSONB
    const {content1, content2, content3, content4, content5} = req.body
    const updatedContent = {
      content1,
      content2,
      content3,
      content4,
      content5
    }

    // Update the entry with the new data
    await db.entry.update(
      { content: updatedContent },
      { where: {id: foundEntry.id }}
      );

    // Redirect the user to the updated entry's detail page
    res.redirect("/entries");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});


// DELETE /entries/:id -- DELETE route to delete an entry
router.delete("/:id", async (req, res) => {
  try {
    // Find the entry with the given ID
    const foundEntry = await db.entry.findOne({
      where: {
        // filter entry by current user logged in
        userId: res.locals.user.id,
        id: req.params.id,
      },
    });

    // Delete the entry
    await foundEntry.destroy();

    // Redirect the user to the entries list
    res.redirect("/entries");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// GET /entries/search

router.get("/search", async (req, res) => {
  try {res.send("hello search")
  } catch (err) {
    console.log(err);
  }
  
  const user = res.locals.user;
  res.render("entries/search.ejs");
});
// export the router instance
module.exports = router;
