const { Configuration, OpenAIApi } = require("openai");
const delay = require("../helpers/delay");
require("dotenv").config();
const OpenAIApiKey = process.env.OPENAI_API_KEY;
const configuration = new Configuration({
  apiKey: OpenAIApiKey,
});
const openai = new OpenAIApi(configuration);
const getArrayFromResult = require("../helpers/getArrayFromResult");
// instructions
const getBlogTitle = "Write one blog title about ";
const getBlogIntro = "Write blog introduction about ";
const getBlogAdvantages = "write 5 pros of ";
const getBlogDisadvantages = "write 5 cons of ";
const getBlogConclusion = "write simple blog conclusion of ";
module.exports = generateBlog = async (blogTerm) => {
  let blogTitle = await getData(getBlogTitle + blogTerm);
  blogTitle = blogTitle.content.trim();
  await delay(60);
  let blogIntro = await getData(getBlogIntro + blogTerm);
  blogIntro = blogIntro.content.trim();
  await delay(60);
  let blogAdvantages = await getData(
    getBlogAdvantages +
      blogTerm +
      " and return the result only in  array structure elements each element not excceding 1 line and contain only the advantages and each one end with <> and not stating with ordered numbers"
  );
  await delay(60);
  blogAdvantages = getArrayFromResult(blogAdvantages.content);
  let blogDisadvantages = await getData(
    getBlogDisadvantages +
      blogTerm +
      " and return the result only in  array structure elements each element not excceding 1 line  and contain only the disadvantages and each one end with <> and not stating with ordered numbers"
  );
  blogDisadvantages = getArrayFromResult(blogDisadvantages.content);
  await delay(60);
  let blogConclusion = await getData(getBlogConclusion + blogTerm);
  await delay(60);
  blogConclusion = blogConclusion.content.trim();
  return {
    title: blogTitle,
    intro: blogIntro,
    pros: blogAdvantages,
    cons: blogDisadvantages,
    conclusion: blogConclusion,
    type: "product",
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
