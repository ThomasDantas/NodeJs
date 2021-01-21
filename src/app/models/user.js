const mongoose = require("../../database");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    unique: true,
    require: true,
    lowercase: true
  },
  emailResetToken: {
    type: String,
    select: false
  },
  emailResetExpires: {
    type: Date,
    select: false
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

const user = mongoose.model("User", UserSchema);

module.exports = user;
