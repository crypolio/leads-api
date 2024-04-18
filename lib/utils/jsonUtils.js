const fs = require('fs');

// Read images JSON file
const readImagesFile = () => {
  const images = fs.readFileSync('./data/images.json', 'utf-8');
  return JSON.parse(images);
}

// Write to images JSON file
const writeImagesFile = (content) => {
  fs.writeFileSync('./data/images.json', JSON.stringify(content));
}

module.exports = {
  readImagesFile,
  writeImagesFile
}