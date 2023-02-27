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

app.get("/", (req, res) => {
  res.render("index", {
    title: "FMS: Landing",
    pageTitle: "Landing Page",
  });
});

app.get("/grooming", (req, res) => {
  res.render("grooming", {
    title: "FMS: About",
    pageTitle: "Grooming",
  });
});

app.get("/boarding", (req, res) => {
  res.render("boarding", {
    title: "FMS: Boarding",
    cardTitle: "Boarding",
    message: "Welcome to Board!",
  });
});

app.get("/training", (req, res) => {
  res.render("training", {
    title: "FMS: Training",
    cardTitle: "Training",
    message: "Welcome to traineng center!",
  });
});

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
    successMessage: null,
    errorMessage: null,
    services: servicesData.services,
  });
});

// HTTP POST route to handle the registration form submission
app.post("/register", async function (req, res) {
  const { name, customerId, email, phone, address, pets } = req.body;
  // Validation
  if (!name || !customerId || !email || !phone || !address || !pets) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  try {
    const newCustomer = new Customer({
      name: name,
      customerId: customerId,
      email: email,
      phone: phone,
      address: address,
      pets: pets,
    });

    Customer.create(
      newCustomer,
      await function (error, customer) {
        if (error) {
          console.log(error);
          res.render("register.ejs", { error: error });
        } else {
          console.log("Customer added successfully: ", customer);
          res.redirect("/");
        }
      }
    );
  } catch (error) {
    res.status(500);
    throw new Error("Dupplicate Error");
  }
});

// HTTP GET route to display the customer list EJS page
app.get("/customers", function (req, res) {
  Customer.find({}, function (error, customers) {
    if (error) {
      console.log(error);
      res.status(500).send("Error retrieving customers.");
    } else {
      console.log(customers);
      res.render("customer-list", { title: "Customers", customers: customers });
    }
  });
});

app.post("/appointments", async (req, res) => {
  try {
    const appointment = new Appointment({
      userName: req.body.firstName + " " + req.body.lastName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      service: req.body.service,
    });
    appointment
      .save()
      .then(() => {
        successMessage = "Appointment has been scheduled successfully";
        res.redirect("/");
      })
      .catch((err) => {
        errorMessage = "Failed to schedule appointment";
        res.redirect("/appointment");
      });
  } catch (err) {
    console.error(err);
    res.redirect("/appointment");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
