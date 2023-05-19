import express from "express";
import { getMainController } from "../controllers/mainController.mjs";

const mainRouter = express.Router();

// 라우터에 controller 등록
mainRouter.get('/', getMainController);

export default mainRouter;