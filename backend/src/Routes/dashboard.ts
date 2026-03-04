import { Router } from "express";
import { getStats, getRecentActivity, getProcessingQueue } from "../Controllers/dashboard";

const router = Router();

router.route("/stats").get(getStats);
router.route("/recent").get(getRecentActivity);
router.route("/processing").get(getProcessingQueue);

export default router
