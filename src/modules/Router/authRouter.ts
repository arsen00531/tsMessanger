import { Router } from "express";
import { AuthController } from "../Controller/authController.js";

const router: Router = Router()
const controller: AuthController = new AuthController()

router.post('/logup', controller.logup)
router.post('/login', controller.login)
router.get('/logout', controller.logout)

export {router as authRouter}