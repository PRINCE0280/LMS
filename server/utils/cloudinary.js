import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config({});

cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET
});
export const uploadToCloudinary = async (file, options = {}) => {
      try {
            // Determine resource type based on file extension
            // Handle both forward and backward slashes in file path
            const fileName = file.split(/[/\\]/).pop();
            const fileExtension = fileName.split('.').pop().toLowerCase();
            const documentTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'zip', 'rar', 'xls', 'xlsx'];
            
            let uploadOptions = {
                  resource_type: 'auto',
                  ...options
            };

            // For document types, use 'raw' resource type
            if (documentTypes.includes(fileExtension)) {
                  uploadOptions.resource_type = 'raw';
            }

            console.log(`Uploading file: ${fileName}, Extension: ${fileExtension}, Resource Type: ${uploadOptions.resource_type}`);

            const UploadResponse = await cloudinary.uploader.upload(file, uploadOptions);
            
            console.log(`Upload successful: ${UploadResponse.url}`);
            
            return UploadResponse;
      } catch (error) {
            console.error("Error uploading to Cloudinary:", error);
            throw new Error("Cloudinary upload failed");
      }
};
export const deleteMediaFromCloudinary = async (publicId) => {
      try {
            await cloudinary.uploader.destroy(publicId);

      } catch (error) {
            console.log("Error deleting from Cloudinary:", error);
      }
};
export const deletevideoFromCloudinary = async (publicId) => {
      try {
            await cloudinary.uploader.destroy(publicId, {
                  resource_type: 'video'
            });
      } catch (error) {
            console.log("Error deleting video from Cloudinary:", error);
      }
};
