import express , {urlencoded} from 'express';
import cors from 'cors';
import cookieParser  from 'cookie-parser';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json({limit: "200mb"}))
app.use(express.urlencoded({limit: "200mb", extended: true}))
app.use(express.static('public'))
app.use(cookieParser())

export default app