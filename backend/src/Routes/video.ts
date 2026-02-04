import { Router } from "express";
import { getCloudUrls, uploadVideo } from "../Controllers/video.js";
import {upload} from "../Middlewares/multer.js"
import { checkStrorage } from "../Middlewares/checkStorage.js";

const router = Router();

router
  .route("/upload")
  .post(
    upload.fields([{ name: "videos", maxCount: 5 }]),
    checkStrorage , uploadVideo,
  );

  router.route("/cloudurls").get(getCloudUrls);
export default router;