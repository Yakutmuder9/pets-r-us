/*
============================================
; Title:  Pets-R-Us dog grooming app
; Author: Professor Krasso
; Date:   28 January 2023
; Modified By: Yakut Ahmedin
; Description: Pets-R-Us dog grooming app
;===========================================
*/

// Express and Node.js import statements
require("dotenv").config();
const express = require("express");
const path = require("path");
const Customer = require("./models/customer");
const app = express();
const mongoose = require("mongoose");
const Appointment = require("./models/appointment");
const bodyParser = require("body-parser");
const fs = require("fs");

// Read services.json file
const rawData = fs.readFileSync("public/data/services.json");
const servicesData = JSON.parse(rawData);

mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URL;

// connect mongoDB url
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  () => console.log("Connected correctly to server"),
  (err) => console.log(err)
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

// Render index.ejs template
app.get("/", (req, res) => {
  res.render("index", {
    title: "FMS: Landing",
    pageTitle: "Landing Page",
  });
});

// Render boarding.ejs template
app.get("/grooming", (req, res) => {
  res.render("grooming", {
    title: "FMS: About",
    pageTitle: "Grooming",
  });
});

// Render boarding.ejs template
app.get("/boarding", (req, res) => {
  res.render("boarding", {
    title: "FMS: Boarding",
    cardTitle: "Boarding",
    message: "Welcome to Board!",
  });
});

// Render training.ejs template
app.get("/training", (req, res) => {
  res.render("training", {
    title: "FMS: Training",
    cardTitle: "Training",
    message: "Welcome to traineng center!",
  });
});

// Render register.ejs template
app.get("/register", (req, res) => {
  res.render("register", {
    title: "FMS: Register",
    cardTitle: "Register",
    message: "Register!",
  });
});

// Render appointment.ejs template and pass servicesData as a variable
app.get("/appointment", (req, res) => {
  res.render("booking", {
    title: "Appointment",
    services: servicesData.services,
  });
});

// HTTP GET route to display an appointment on EJS page
app.get("/my-appointments", (req, res) => {
  res.render("my-appointments", {
    title: "My Appointments",
    services: servicesData.services,
  });
});

// HTTP POST route to handle the registration form submission
app.post("/register", async (req, res) => {
  const { customerId, email } = req.body;

  try {
    // Check if customer already exists in database
    const existingCustomer = await Customer.findOne({
      $or: [{ customerId }, { email }],
    });

    if (existingCustomer) {
      // Customer already exists
      res.send("Customer already exists");
    } else {
      // Add new customer to database
      const newCustomer = new Customer({
        customerId: customerId,
        email: email,
      });

      await newCustomer.save();
      res.status(200).send("Registered successfully");
    }
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal server error", { error: err });
  }
});

// HTTP GET route to display the customer list EJS page
app.get("/customers", function (req, res) {
  Customer.find({}, function (error, customers) {
    if (error) {
      console.log(error);
      res.status(500).send("Error retrieving customers.");
    } else {
      res.render("customer-list", { title: "Customers", customers: customers });
    }
  });
});

//  HTTP GET route to display an appointment on EJS page
app.post("/appointments", async (req, res) => {
  try {
    const appointment = new Appointment({
      userName: req.body.firstName + " " + req.body.lastName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      service: req.body.service,
    });
    console.log("Appointment successfully saved!", appointment);
    await appointment.save();
    res.redirect("/");
  } catch (err) {
    console.error("error saving the appointment", err);
    res.redirect("/appointment");
  }
});

//  HTTP GET route to display facthed list of customer appointment on EJS page
app.get("/api/appointments", (req, res) => {
  const email = req.query.email;

  Appointment.findOne({ email: email }, (err, appointment) => {
    if (err) {
      console.error(err);
    } else {
      if (appointment) {
        res.json(appointment);
      } else {
        res.json(`The email ${email} was not found in the database.`);
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
