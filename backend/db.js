const mongoose = require("mongoose");
const mongoURI = "mongodb://localhost:27017/";

const connectToMongo = () => {
    mongoose.connect(mongoURI)
        .then(() => {
            console.log("Connected to Mongo Successfully");
        })
        .catch((error) => {
            console.error("Failed to connect to Mongo", error);
        });
}

module.exports = connectToMongo;
