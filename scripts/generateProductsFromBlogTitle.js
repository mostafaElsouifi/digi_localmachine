const puppeteer = require("puppeteer");
const { Configuration, OpenAIApi } = require("openai");
const openai = new OpenAIApi(configuration);
// const Blog = require("../db/models/blog");
const HealthBlog = require("../db/models/healthBlog");
const Product = require("../db/models/product");
const delay = require("../helpers/delay");
const getAmazonProducts = require("../scripts/getAmazonProducts");

async function getProductName(prompt) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: `${prompt}` }],
    temperature: 1,
  });
  return completion.data.choices[0].message;
}
const mongoose = require("mongoose");
(async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(
      "mongodb+srv://ongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("mongo db is connected");
  } catch (e) {
    console.log(e);
  }
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100, // slow down actions by 100ms
    // args: ["--incognito"],
  });
  const page = await browser.newPage();

  // navigate to Amazon website
  await page.goto("https://www.amazon.com/");
  await delay(20);
  await page.click("#nav-link-accountList");
  await delay(5);
  await page.type("#ap_email", AMAZON_EMAIL);
  await page.click("#continue");
  await delay(3);
  await page.type("#ap_password", AMAZON_PASSWORD);
  await page.click("#signInSubmit");
  await delay(20);

  let allBlogs = await HealthBlog.find({ type: "product" });
  allBlogs = allBlogs.filter((b) => b.products.length === 0);

  //loop trough all blogs check blog title then search

  for (let i = 0; i < allBlogs.length; i++) {
    console.log(`blog : ${i}`);
    const searchTerm = await getProductName(
      `suggest me one product that can fit this title: ${allBlogs[i].title}. return just the type of product that can be searched in amazon  `
    );
    console.log(searchTerm);
    let currentBlog = await HealthBlog.findById(allBlogs[i]._id);
    let products;
    try {
      products = await getAmazonProducts(page, searchTerm.content);
    } catch (e) {
      console.log(e);
      //   products = await getAmazonProducts(allBlogs[i].productsName);
    }
    if (products.length > 0) {
      for (let i = 0; i < products.length; i++) {
        const newProduct = new Product(products[i]);
        await newProduct.save();
        await currentBlog.products.push(newProduct._id);
        await currentBlog.save();
      }
    }
  }
})();
