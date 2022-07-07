import { v2 as cloudinary } from "cloudinary";
import AppError from "./appError.js";


function uploadToCloudinary(data) {
  return new Promise((resolve, reject) => {
    let cloudinaryUploadStream = cloudinary.uploader.upload_stream(function (
      error,
      image
    ) {
      if (error) {
        reject(new AppError("Image upload failed"));
      } else {
        resolve(image);
      }
    });
    // data.file -> readable stream
    data.file.pipe(cloudinaryUploadStream);
  });
}


async function teamLogo(request) {
  let data = await request.file();
  let image = await uploadToCloudinary(data);
  return image.url;
}

/**
 * Image upload for team-members could be feature later
 * But should it be done? Just considering privacy in overall and.
 */

/* async function userImage(request) {
  let data = await request.file();
  let image = await uploadToCloudinary(data);
  return image.url;
} */

export default {
  teamLogo,
}