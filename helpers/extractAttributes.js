module.exports = extractedAttributes = (text) => {
  const hrefPattern = /href="([^"]+)"/;
  const srcPattern = /src="([^"]+)"/g;

  const extractedAttributes = [];

  // Extract href attribute
  const hrefMatch = text.match(hrefPattern);
  if (hrefMatch) {
    extractedAttributes.push(hrefMatch[1]);
  }

  // Extract first two src attributes
  let matchCounter = 0;
  let match;
  while (matchCounter < 2 && (match = srcPattern.exec(text)) !== null) {
    extractedAttributes.push(match[1]);
    matchCounter++;
  }

  return extractedAttributes;
};
