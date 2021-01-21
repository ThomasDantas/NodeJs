const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://admin:admin123@cluster0-bvoou.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(connectionString);

module.exports = mongoose;
