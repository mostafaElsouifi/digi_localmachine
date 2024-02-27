const mongoose = require("mongoose");
const Product = require("./product");
const Schema = mongoose.Schema;
const HealthBlogSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  /* the main image will accept Array for href text and src text as it is coming from amazon stripe 
  first elemnt will href  - second : src , third another src 
  */
  mainImage: {
    type: Array,
    require: true,
  },
  type: String,
  intro: {
    type: String,
    require: true,
  },
  category: {
    type: String,
  },
  pros: {
    type: Array,
    require: true,
  },
  cons: {
    type: Array,
    require: true,
  },
  productFeatures: {
    type: Array,
  },

  youtubeLink: String,
  affiliateLink: String,
  productUrl: String,
  website: String,
  price: String,
  ratings: String,
  ratingsPercentage: String,

  conclusion: {
    type: String,
    require: true,
  },
  products: [{ type: Schema.Types.ObjectId, ref: Product }],
});
module.exports = mongoose.model("HealthBlog", HealthBlogSchema);
