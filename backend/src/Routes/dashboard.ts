import { Router } from "express";
import { getStats } from "../Controllers/dashboard";

const router = Router();

router.route("/stats").get(getStats);

export default router