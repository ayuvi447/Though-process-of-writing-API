import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv'
import fs from "fs";
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return null;
    }
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
      // Log successful upload     //file has been uploaded successfully
    console.log("File uploaded on Cloudinary:", response.url);

    //Always delete local file after successful upload
    fs.unlinkSync(localFilePath);

    return response.url;
  } catch (error) {
    console.log("upload error h vicky kuch", error);
    
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};
// Upload an image



export {uploadOnCloudinary} 