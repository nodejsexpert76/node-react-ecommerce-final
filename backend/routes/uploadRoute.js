import express from 'express';
import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import config from '../config';

const router = express.Router();

// Local Upload
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});
const upload = multer({ storage });
router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

// AWS S3 Upload
aws.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});
const s3 = new aws.S3();
const uploadS3 = multer({
  storage: multerS3({
    s3,
    bucket: 'node-react-ecommerce-app',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});
router.post('/s3', uploadS3.single('image'), (req, res) => {
  res.send(req.file.location);
});
export default router;
