import { uploadToCloudinary } from '../middleware/upload.js';

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) return res.status(422).json({ message: 'No file provided' });
    const result = await uploadToCloudinary(req.file.buffer);
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (err) {
    next(err);
  }
}
