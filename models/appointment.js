// ============================================
// ; Title:  Pets-R-Us dog grooming app
// ; Author: Professor Krasso
// ; Date:   26 February 2023
// ; Modified By: Yakut Ahmedin
// ; Description: Pets-R-Us dog grooming app
// ;===========================================
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  service: {
    type: String,
    required: true
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;