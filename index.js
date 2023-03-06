const dotenv = require('dotenv');
const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
dotenv.config();
const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-route");
require("./cinfig/passport");
// const cookieSession = require('cookie-session');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => {
    console.log("Successfully connected to mongoDB atlas.");
  })
  .catch((e) => {
    console.log("Connection failed.");
    console.log(e);
  });

  //middleware
  app.set("view engine", "ejs");
  app.use(express.json());
  app.use(express.urlencoded({extended:true}));
  // app.use(cookieSession({
  //   keys: [process.env.SECERT],
  // }));
  app.use(session({
    secret: process.env.SECERT,
    resave: false,
    saveUninitialized: true,
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use( ( req, res, next ) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error")
    next();
  })
  app.use("/auth", authRoute);
  app.use("/profile", profileRoute);

  app.get("/",(req,res)=>{
    res.render("index" , {user : req.user});
  })

  app.listen(8080, () => {
    console.log("Server is running on port 8080.")
  });


