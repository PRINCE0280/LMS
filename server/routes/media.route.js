import express from 'express';
import upload from '../utils/multer.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const router = express.Router();
router.route('/upload-video').post(upload.single('file'), async (req, res) => {
      try {
            console.log("File received:", req.file);
            if (!req.file) {
                  return res.status(400).json({
                        success: false,
                        message: 'No file uploaded'
                  });
            }
            const result = await uploadToCloudinary(req.file.path);
            console.log("Upload result:", result);
            return res.status(200).json({
                  success: true,
                  message: 'Video uploaded successfully',
                  data: result
            });

      } catch (error) {
            console.error("Upload error:", error);
            return res.status(500).json({
                  success: false,
                  message: 'Error in uploading file',
                  error: error.message
            });

      }
});

router.route('/upload-file').post(upload.single('file'), async (req, res) => {
      try {
            if (!req.file) {
                  return res.status(400).json({
                        success: false,
                        message: 'No file uploaded'
                  });
            }
            const result = await uploadToCloudinary(req.file.path);
            return res.status(200).json({
                  success: true,
                  message: 'File uploaded successfully',
                  data: result
            });

      } catch (error) {
            console.error("Upload error:", error);
            return res.status(500).json({
                  success: false,
                  message: 'Error uploading file',
                  error: error.message
            });

      }
});

export default router;
