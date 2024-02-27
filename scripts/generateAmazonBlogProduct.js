const { Configuration, OpenAIApi } = require("openai");
const delay = require("../helpers/delay");
const extractAttributes = require("../helpers/extractAttributes");
const getYoutubeLink = require("./getYoutubeLink");
const puppeteer = require("puppeteer");
const items = require("../texts/newData");
const Blog = require("../db/models/blog");
const Product = require("../db/models/product");
const BabyBlog = require("../db/models/babyBlog");
const HealthBlog = require("../db/models/healthBlog");
const mongoose = require("mongoose");
const openai = new OpenAIApi(configuration);
const getArrayFromResult = require("../helpers/getArrayFromResult");
// instructions
const getBlogTitle = "Write one blog title about this product  ";
const getBlogIntro = "then Write blog introduction about it";
const getBlogAdvantages = "write 5 pros of ";
const getBlogDisadvantages = "write 5 cons of ";
const getProductFeatures = "write some features about this product";
const getBlogConclusion = "write simple blog conclusion of ";

const generateBlog = async (productTitle) => {
  let blogTitle = await getData(getBlogTitle + productTitle);
  blogTitle = blogTitle.content.trim();
  //await delay(60);
  let blogIntro = await getData(getBlogIntro + productTitle);
  blogIntro = blogIntro.content.trim();
  //await delay(60);
  let blogAdvantages = await getData(
    getBlogAdvantages +
      blogTitle +
      " .\n and return the result only in  array structure elements each element not excceding 1 line and contain only the advantages and each one end with <> and not stating with ordered numbers"
  );
  await delay(60);
  blogAdvantages = getArrayFromResult(blogAdvantages.content);
  let blogDisadvantages = await getData(
    getBlogDisadvantages +
      blogTitle +
      ". \nand return the result only in  array structure elements each element not excceding 1 line  and contain only the disadvantages and each one end with <> and not starting with ordered numbers"
  );
  blogDisadvantages = getArrayFromResult(blogDisadvantages.content);
  //await delay(60);
  let productFeatures = await getData(
    getProductFeatures +
      productTitle +
      " . \n and return the result only in  array structure elements.  each element not excceding 1 line and each one end with <> and not starting with ordered numbers"
  );
  productFeatures = getArrayFromResult(productFeatures.content);
  await delay(60);

  let blogConclusion = await getData(getBlogConclusion + productTitle);
  await delay(60);
  blogConclusion = blogConclusion.content.trim();
  return {
    title: blogTitle,
    intro: blogIntro,
    productFeatures: productFeatures,
    pros: blogAdvantages,
    cons: blogDisadvantages,
    conclusion: blogConclusion,
    type: "product",
    website: "amazon",
  };
};

// function to get data from chatgpt
async function getData(prompt) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: `${prompt}` }],
    temperature: 1,
  });
  return completion.data.choices[0].message;
}

(async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(
      "mongodb+srv://dig.mongodb.net/?retryWrites=true&w=majority",
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
  console.log(items.length);
  for (let i = 0; i < items.length; i++) {
    const blog = await generateBlog(items[i].productTitle);

    // goto amazon product link
    await page.goto(items[i].productUrl);
    await delay(10);
    // start extract all page data neaded
    // price
    blog.price = await page.evaluate(() => {
      try {
        return document.querySelector(".priceToPay").textContent.trim() || "";
      } catch (e) {
        return "";
      }
    });
    // ratings
    blog.ratings = await page.evaluate(() => {
      try {
        return (
          document
            .querySelector("#acrCustomerReviewText")
            ?.textContent.replace("ratings", "")
            .replace("rating", "")
            .trim() || ""
        );
      } catch (e) {
        return "";
      }
    });
    // ratingspercentage
    blog.ratingsPercentage = await page.evaluate(() => {
      try {
        return document
          .querySelector("#averageCustomerReviews")
          ?.textContent.trim()
          .split(" ")[0];
      } catch (e) {
        return "";
      }
    });
    // image link from stripe

    await page.click('span[data-action="amzn-ss-show-image-popover"]');
    await delay(2);
    await page.click("#amzn-ss-large-image-radio-button");
    await delay(2);
    blog.mainImage = await page.evaluate(() => {
      const text = document.querySelector(
        "#amzn-ss-image-textarea"
      ).textContent;

      return text;
    });
    blog.mainImage = extractAttributes(blog.mainImage);
    await delay(3);
    await page.click('span[data-action="amzn-ss-show-text-popover"]');
    await delay(5);

    blog.affiliateLink = await page.evaluate(() => {
      return document
        .querySelector("#amzn-ss-text-shortlink-textarea")
        .textContent.trim();
    });
    try {
      blog.youtubeLink = await getYoutubeLink(items[i].productTitle);
    } catch (e) {
      blog.youtubeLink = "";
    }

    blog.productUrl = items[i].productUrl;
    blog.category = items[i].category;
    // search more proucts in the same category
    

    const newBlog = new HealthBlog(blog);
    await newBlog.save();
    console.log(`blog ${i}: Done`);
  }
})();
