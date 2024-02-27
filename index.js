const generateBlog = require("./scripts/generateBlog");
const getBlogImage = require("./scripts/getBlogImg");
const getYoutubeLink = require("./scripts/getYoutubeLink");
//const getAmazonProducts = require("./scripts/getAmazonProducts");
const Blog = require("./db/models/blog");
//const Product = require("./db/models/product");
const delay = require("./helpers/delay");
const mongoose = require("mongoose");

(async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("mongo db is connected");
  } catch (e) {
    console.log(e);
  }
})();

const generateBlogWithProducts = async (searchTerm) => {
  console.log("start");
  const obj = {};
  let blog;
  await delay(3);
  blog = await generateBlog(searchTerm);

  const image = await getBlogImage(searchTerm);
  const youtubeLink = await getYoutubeLink(searchTerm);
  // let products;
  // try {
  //   products = await getAmazonProducts(searchTerm);
  // } catch (e) {
  //   products = await getAmazonProducts(searchTerm);
  // }
  await delay(3);

  obj.blog = blog;
  obj.blog.mainImage = image;
  obj.blog.youtubeLink = youtubeLink;
  /**manual data will be changed later  */
  obj.blog.category = "health & beauty";
  obj.blog.productsName = searchTerm;
  // upload to db ;
  const newBlog = new Blog(obj.blog);
  await newBlog.save();

  // obj.products = products;
  // let newProduct;
  // if (obj.products.length > 0) {
  //   for (let i = 0; i < obj.products.length; i++) {
  //     newProduct = new Product(obj.products[i]);
  //     await newProduct.save();
  //     await delay(2);
  //     newBlog.products.push(newProduct._id);
  //     await newBlog.save();
  //   }
  // }

  //
  await delay(120);
  return { newBlog /*newProduct*/ };
};
product = [
  ""
];
(async () => {
  for (let i = 0; i < product.length; i++) {
    try {
      await delay(8);
      await generateBlogWithProducts(`${product[i]}`);
    } catch (e) {
      await delay(20);
      await generateBlogWithProducts(`${product[i]}`);
      console.log(e);
    }
    console.log(`done index :${i}`);
  }
})();

// generateBlog("vitamin D").then((d) => {
//   console.log(d);
// });

// getYoutubeLink("vitamin c").then((d) => console.log(d));
