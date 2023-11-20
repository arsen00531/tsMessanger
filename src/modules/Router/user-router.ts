import { Router } from "express";
import { UserController } from "../Controller/user-controller.js";
import multer from 'multer';
import path from "path";

const router: Router = Router()
const controller: UserController = new UserController()
const upload = multer({ dest: path.join(path.resolve(), 'views', 'user_images') })

router.get('/', controller.main)
router.get('/login', controller.login)
router.get('/logall', controller.logAll)
router.get('/users', controller.users)
router.get('/profile', controller.profile)
router.get('/chat', controller.anonimeChat)
router.post('/imageChange', upload.single("file"), controller.imageChange)

export {router as userRouter}