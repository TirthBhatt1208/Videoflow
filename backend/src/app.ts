import express , {urlencoded} from 'express';
import cors from 'cors';
import cookieParser  from 'cookie-parser';
import { clerkMiddleware } from '@clerk/express';
import {ensureUser} from "./Middlewares/ensureUser"

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json({limit: "200mb"}))
app.use(express.urlencoded({limit: "200mb", extended: true}))
app.use(express.static('public'))
app.use(cookieParser())

app.use(clerkMiddleware())
app.use(ensureUser)
export default app