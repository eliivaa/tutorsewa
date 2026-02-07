

// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
// });

// export async function uploadToCloudinary(file: File) {
//   const buffer = Buffer.from(await file.arrayBuffer());

//   const isPDF = file.type === "application/pdf";

//   return new Promise<string>((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: isPDF ? "raw" : "image", // ✅ FIX
//         folder: "tutorsewa",
//         use_filename: true,
//         unique_filename: true,
//       },
//       (error, result) => {
//         if (error) {
//           reject(error);
//         } else {
//           resolve(result!.secure_url);
//         }
//       }
//     );

//     uploadStream.end(buffer);
//   });
// }

// export default cloudinary;


import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function uploadToCloudinary(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  // ✅ detect PDF
  const isPDF =
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf");

  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: isPDF ? "raw" : "image", // ✅ FIX
        folder: "tutorsewa",
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
}

export default cloudinary;
