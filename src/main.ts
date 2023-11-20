import 'dotenv/config'
import express, { Application } from 'express'
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io';
import ejs from 'ejs'
import { authRouter } from './modules/Router/authRouter.js'
import { userRouter } from './modules/Router/user-router.js'
import { socket } from './modules/soket.js';

const PORT: number = Number(process.env.PORT) || 3000
const app: Application = express()

app.engine('html', ejs.renderFile);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('views'));
app.use(authRouter)
app.use(userRouter)

const server = app.listen(PORT, () => console.log(`SERVER WORK ON PORT ${PORT}`))
const io: Server = new Server(server);

socket(io)