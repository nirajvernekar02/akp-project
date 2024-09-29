const mongoose = require('mongoose');
require('dotenv').config();
const connectToMongo = () => {
    mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
      .then(() => console.log("Connected to MongoDB successfully"))
      .catch((err) => console.error("Error connecting to MongoDB", err));
  }
  

module.exports = connectToMongo;

