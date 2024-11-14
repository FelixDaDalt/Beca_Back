import { Router } from "express"
import { Login } from "../controllers/login.controller"

const router = Router()

router.post('/', Login)
export {router}