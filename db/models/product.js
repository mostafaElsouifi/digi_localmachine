const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  category: {
    type: String,
  },
  store: {
    type: String,
  },
  affiliateLink: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  country: {
    type: String,
  },
});

module.exports = mongoose.model("Product", productSchema);
