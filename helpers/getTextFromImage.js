const { createWorker } = require("tesseract.js");

const worker = createWorker({
  //logger: (m) => console.log(m),
});

module.exports = getTextFromImage = async (imgUrl) => {
  try {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(imgUrl);
    await worker.terminate();
    return text;
  } catch (e) {
    console.log(e);
  }
};
