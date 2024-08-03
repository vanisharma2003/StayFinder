const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); // Adjust path if necessary

main()
  .then(() => {
    console.log("Connection established");
    return initDB();
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://sharmavani440:vani2003@cluster0.q2hzxcm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data initialization SUCCESS");
  } catch (error) {
    console.log("Data initialization ERROR: ", error);
  }
};
