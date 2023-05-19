import express from "express";
import {
    deleteArticleController,
    getArticleController,
    postArticleController,
    putArticleController
} from "../controllers/articleController.mjs";
const articleRouter = express.Router();

// 라우터에 controller 등록
articleRouter.route('/article').get(getArticleController);
articleRouter.route('/article').post(postArticleController);
articleRouter.route('/article').put(putArticleController);
articleRouter.route('/article').delete(deleteArticleController);
export default articleRouter;