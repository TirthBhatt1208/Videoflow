import express , {urlencoded} from 'express';
import cors from 'cors';
import cookieParser  from 'cookie-parser';
import { clerkMiddleware } from '@clerk/express';
import {ensureUser} from "./Middlewares/ensureUser.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "200mb"}))
app.use(express.urlencoded({limit: "200mb", extended: true}))
app.use(express.static('public'))
app.use(cookieParser())

app.use(clerkMiddleware())
app.use(ensureUser)


import videoRoutes from "./Routes/video.js";
import dashboardRoutes from "./Routes/dashboard.js"

app.use("/api/videos", videoRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app