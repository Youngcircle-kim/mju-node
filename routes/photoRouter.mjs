import express from 'express';
import {getPhotoController, postPhotoController} from "../controllers/photoController.mjs";
import multer from "multer";
import path from "path";

const photoRouter = express.Router();

// 멀터 설정
const storage = multer.diskStorage({
    destination(req, file, done) {
        done(null, 'uploads/');
    },
    filename(req, file, done) { // 원본 파일 이름 + _ + 시간 + 확장자
        const ext = path.extname(file.originalname);
        done(null, path.basename(file.originalname, ext) + '_' + Date.now() + ext);
    },
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
});

// 라우터에 controller 등록
photoRouter.route('/photo').get(getPhotoController);
photoRouter.route('/photo').post(upload.array("manyImages"), postPhotoController);

export default photoRouter;