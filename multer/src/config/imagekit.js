const ImageKit = require("imagekit");

const storageInstance = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUB_KEY,
  privateKey: process.env.IMAGEKIT_PRI_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL,
});

const sendFile = async (file, fileName) => {
  return await storageInstance.upload({ file, fileName });
};

module.exports = sendFile;
