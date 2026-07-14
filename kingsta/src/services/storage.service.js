import dotenv from "dotenv";
dotenv.config();
import Imagekit from "imagekit";

const storageInstance = new Imagekit({
  publicKey: process.env.IK_PUB_KEY,
  privateKey: process.env.IK_PRI_KEY,
  urlEndpoint: process.env.IK_URL,
});

export const sendFiles = async (file, fileName) => {
  let obj = {
    file,
    fileName,
    folder: "kingsta",
  };

  return await storageInstance.upload(obj);
};
