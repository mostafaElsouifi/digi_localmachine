const axios = require("axios");

const searchQuery = "vitamin A"; // Replace with your desired search query
const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo`;

axios
  .get(apiUrl)
  .then((response) => {
    const data = response.data;
    if (data.hits && data.hits.length > 0) {
      const images = data.hits;
      images.forEach((image) => {
        console.log(image.webformatURL);
      });
    } else {
      console.log("No images found.");
    }
  })
  .catch((error) => {
    console.error("Error fetching images:", error);
  });
