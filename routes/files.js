import { Router } from "express";
const router = Router();

import {uploadMiddleware, uploadFile} from '../controllers/file.controller.js'

// Define the route and use the upload middleware and uploadFile function
router.post('/upload', uploadMiddleware, uploadFile);

export default router;
