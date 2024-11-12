const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// APPLICATION DU PLUGIN UNIQUEVALIDATOR AU SCHEMA
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
