import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Set storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'files/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Create multer instance
const upload = multer({ storage });

// Define the upload middleware
const uploadMiddleware = upload.single('file');

// Define the upload function
const uploadFile = (req, res) => {
  const file = req.file;
  const imageId = Math.floor(Math.random() * 100) + 1;
  const alt = `Product Image ${imageId}`;
  const src = `${process.env.LOCAL_API_URL}${file.filename}`;
  const id = uuidv4();

  const responseObject = {
    image_id: imageId,
    alt,
    src,
    id
  };

  res.json(responseObject);
};

export { uploadMiddleware, uploadFile };
