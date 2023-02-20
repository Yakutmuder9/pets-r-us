/*
============================================
; Title:  index.js
; Author: Professor Krasso
; Date:   28 January 2023
; Description: Server and route file for hello-world app
;===========================================
*/

// Express and Node.js import statements
require('dotenv').config();
const express = require("express");
const path = require("path");
const Customer = require("./models/customer");
const app = express();
const mongoose = require("mongoose");

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

app.get("/customers", (req, res) => {
  res.render("customer-list", {
    title: "FMS: Customers",
    cardTitle: "Customers",
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
      res.render("customer-list", { customers: customers });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at PORT ${PORT}`);
});
