import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;

// To check cloudinary setup
// cloudinary.uploader.upload("https://res.cloudinary.com/demo/image/upload/sample.jpg")
//   .then(result => console.log("Upload successful:", result.secure_url))
//   .catch(error => console.error("Upload failed:", error));