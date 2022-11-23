const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

main().catch((err) => {
  console.log("CONNECTION ERROR!!");
  console.log(err);
});
async function main() {
  await mongoose.connect("mongodb://localhost:27017/yelp-camp");
  console.log("DATABASE CONNECTED");
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  // const camp = new Campground({ title: 'purple field' });
  for (let i = 0; i < 50; i++) {
    // const random1000 = Math.floor((Math.random()) * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      // location: `${cities[random1000].city}, ${cities[random1000].state}`,
      location: `${sample(cities).city}, ${sample(cities).state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis eius est soluta aperiam voluptate dolorem, ab sint, veritatis magnam laboriosam, eligendi a voluptas enim! Voluptatem voluptatum perspiciatis quam magnam optio.",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
