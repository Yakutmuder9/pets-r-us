// ============================================
// ; Title:  Pets-R-Us dog grooming app
// ; Author: Professor Krasso
// ; Date:   05 February 2023
// ; Modified By: Yakut Ahmedin
// ; Description: Pets-R-Us dog grooming app
// ;===========================================
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  customerId: {
    type: Number,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
});

const Customer = mongoose.model("Customers", customerSchema);
module.exports = Customer;
