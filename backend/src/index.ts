import dotenv from 'dotenv';
dotenv.config({path: "./.env"});
import app from './app.js';


const Port: number | string = process.env.PORT || 3000;

app.listen(Port, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})