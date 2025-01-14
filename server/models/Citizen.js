const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const citizenSchema = new mongoose.Schema({
  name: String,
  age: Number,
});

const Citizen = mongoose.model("Citizen", citizenSchema);

module.exports = Citizen;
