import express from "express";
import { getLoginController, postLoginController } from "../controllers/loginController.mjs";

const loginRouter = express.Router();

// 라우터에 controller 등록
loginRouter.route('/login').get(getLoginController);
loginRouter.route('/login').post( postLoginController);

export default loginRouter;