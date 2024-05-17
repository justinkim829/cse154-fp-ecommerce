'use strict';

const express = require('express');
const app = express();

// other required modules ...
const multer = require("multer"); // import multer into your project

// For data sent as form-urlencoded
app.use(express.urlencoded({ extended: true }));
// For data sent as json
app.use(express.json());
// For data sent as a form
app.use(multer().none()); // requires the "multer" module


app.post("REM/login",(req,res)=>{
  let username=req.body.username;
  let password=req.body.password;

  //connnect with database

})

app.post("/REM/createAccount",(req,res)=>{
  let email = req.body.email;
    let password = req.body.password;
    let gender = req.body.gender;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let month = req.body.month;
    let day = req.body.day;
    let year = req.body.year;
})





app.use(express.static('public'));
const PORT = process.env.PORT || 8080;
app.listen(PORT);