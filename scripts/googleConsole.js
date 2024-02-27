const puppeteer = require("puppeteer");
const mongoose = require("mongoose");
const delay = require("../helpers/delay");
const Blog = require("../db/models/blog");
const BabyBlog = require("../db/models/babyBlog");
const HealthBlog = require("../db/models/healthBlog");

(async () => {
  mongoose.set("strictQuery", false);
  try {
    await mongoose.connect(
      "mongodb+srj@cluster0.o2iknfl.mongodb.net/?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("mongo db is connected");
  } catch (e) {
    console.log(e);
  }
})();

const indexGoogle = async () => {
  let allBlogs;
  const blogs = await BabyBlog.find({});
  const babyBlogs = await BabyBlog.find({});
  const healthBlogs = await HealthBlog.find({});
  allBlogs = [...babyBlogs, ...healthBlogs, blogs];
  const blogsRoutes = allBlogs.map(
    (b) => `https://digiversify.com/blog/${b._id}`
  );
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200, // slow down actions by 100ms
    executablePath:
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    ignoreDefaultArgs: [
      "--enable-automation",
      "--disable-extensions",
      "--disable-default-apps",
      "--disable-component-extensions-with-background-pages",
    ],
    // args: ["--incognito"],
  });

  const page = await browser.newPage();
  await page.goto(
    "https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Adigiversify.com"
  );
  //   await page.type('input[type="email"]', "digiversify.blogs@gmail.com");
  //   await page.click("#identifierNext");
};
indexGoogle().then();
