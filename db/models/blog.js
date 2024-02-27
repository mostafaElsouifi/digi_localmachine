const mongoose = require("mongoose");
const Product = require("./product");
const Schema = mongoose.Schema;
const blogSchema = new Schema({
  title: {
    type: String,
    require: true,
  },
  mainImage: {
    type: String,
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
  youtubeLink: String,
  mainProduct: String,
  productsName: String,
  conclusion: {
    type: String,
    require: true,
  },
  products: [{ type: Schema.Types.ObjectId, ref: Product }],
});
module.exports = mongoose.model("Blog", blogSchema);
