/**I use PEXELS API to get an image for a blog
 * https://www.pexels.com/api/
 */

const { createClient } = require("pexels");
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const client = createClient(PEXELS_API_KEY);

module.exports = getBlogImage = async (query) => {
  const image = await client.photos.search({ query, per_page: 1 });
  // .then((data) => (image = data.photos[0].src.landscape));

  return image.photos[0]?.src.landscape || "";
};

// /* second approach to get blog image from amazon products */
// module.exports = getBlogImage = async (products) => {
//   const randomNum = Math.floor(Math.random() * 3);
//   return products[randomNum].image;
// };
