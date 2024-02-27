const puppeteer = require("puppeteer");

module.exports = getYoutubeLink = async (searchTerm) => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Go to YouTube
    await page.goto("https://www.youtube.com");

    // Search for videos
    await page.type("input#search", searchTerm);
    await page.click("#search-icon-legacy");
    await page.waitForSelector("#contents.ytd-item-section-renderer");

    // Select the most viewed video on the first page
    const mostViewedVideo = await page.evaluate(() => {
      const videoElements = document.querySelectorAll("ytd-video-renderer");
      let mostViewedVideo;
      let maxViews = 0;
      videoElements.forEach((video) => {
        const views = parseInt(
          video
            .querySelector("#metadata-line span")
            .innerText.replace(/,/g, "")
            .replace("K", "000")
            .replace("M", "000000")
        );
        if (views > maxViews) {
          maxViews = views;
          mostViewedVideo = video;
        }
      });

      return mostViewedVideo.querySelector("#thumbnail").href;
    });
    await browser.close();
    // Get the embedded link for the video
    let videoId = mostViewedVideo.split("=")[1];

    videoId = videoId.replace("&pp", "");
    const embeddedLink = `https://www.youtube.com/embed/${videoId}`;
    return embeddedLink;
  } catch (e) {
    console.log(e);
  }
};
