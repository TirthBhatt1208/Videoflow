import { Router } from "express";
import { uploadVideo } from "../Controllers/video.js";
import {upload} from "../Middlewares/multer.js"

const router = Router();

router.route("/upload").post(upload.fields([{ name: "videos" , maxCount: 5}]), uploadVideo);

export default router;