const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    customerId: { type: Number, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true }
    },
    pets: [
        {
            name: { type: String, required: true },
            breed: { type: String, required: true },
            age: { type: Number, required: true },
            lastVisit: { type: Date, default: Date.now },
            discription: { type: String }
        }
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
},
    { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
module.exports = Customer;

