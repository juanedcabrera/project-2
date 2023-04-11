// required packages
const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const cryptoJs = require("crypto-js");

// GET /users/new -- show route for a form that creates a new user (sign up for the app)
router.get("/new", (req, res) => {
  if (res.locals.user) {
    res.redirect("./main");
  } else {
    res.render("users/new.ejs");
  }
});

// GET /users/login -- show route for a form that lets a user login
router.get("/login", (req, res) => {
  if (res.locals.user) {
    res.redirect("./main");
  } else {
    res.render("users/login.ejs", { message: req.query.message });
  }
});

// GET /users/profile -- take user to their profile page
router.get("/profile", (req, res) => {
  const user = res.locals.user;
  res.render("users/profile.ejs", { user });
});


// POST /users/login -- authenticate a user's credentials
router.post("/login", async (req, res) => {
  try {
    console.log(req.body);
    // search for the user's email in the db
    const foundUser = await db.user.findOne({
      where: {
        email: req.body.email,
      },
    });
    const failedLoginMessage = "Incorrect email or password 🙁";
    if (!foundUser) {
      // if the user's email is not found -- do not let them login
      console.log("user not found");
      res.redirect("/users/login?message=" + failedLoginMessage);
    } else if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
      console.log("incorrect password");
      // if the user exists but they have the wrong password -- do not let them login
      res.redirect("/users/login?message=" + failedLoginMessage);
    } else {
      // if the user exists, they know the right password -- log them in
      const encryptedPk = cryptoJs.AES.encrypt(
        foundUser.id.toString(),
        process.env.ENC_KEY
      );
      // set encrypted id as a cookie
      res.cookie("userId", encryptedPk.toString());
      // redirect user
      res.redirect("/users/main");
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

// GET /users/logout -- log out the current user
router.get("/logout", (req, res) => {
  console.log("logging user out!");
  res.clearCookie("userId");
  res.redirect("/");
});

// GET /users/main -- show authorized users their main page
router.get("/main", (req, res) => {
  // check for the userId cookie
  const encryptedPk = req.cookies.userId;
  if (!encryptedPk) {
    // if the cookie is not present, redirect the user to the login page
    res.redirect(
      "/users/login?message=You are not authorized to view that page. Please authenticate to continue 😎"
    );
  } else {
    // decrypt the user ID and find the user in the database
    const userId = parseInt(
      cryptoJs.AES.decrypt(encryptedPk, process.env.ENC_KEY).toString(
        cryptoJs.enc.Utf8
      )
    );
    db.user
      .findByPk(userId)
      .then((user) => {
        if (!user) {
          // if the user is not found in the database, redirect to the login page
          res.redirect(
            "/users/login?message=You are not authorized to view that page. Please authenticate to continue 😎"
          );
        } else {
          // if the user is found in the database, render the main page
          res.render("users/main.ejs", { user });
        }
      })
      .catch((error) => {
        console.log(error);
        // res.redirect("/");
      });
  }
});

// export the router instance
module.exports = router;
