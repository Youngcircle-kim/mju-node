import express from 'express';
import morgan from 'morgan';
import path from "path";
import cookieParser from "cookie-parser";
import session from 'express-session';
import loginRouter from "./routes/loginRouter.mjs";
import mainRouter from "./routes/mainRouter.mjs";
import articleRouter from "./routes/articleRouter.mjs";
import photoRouter from "./routes/photoRouter.mjs";
import * as fs from "fs";

const app = express();
const __dirname = path.resolve()

//템플릿 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 미들웨어 설정
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'secret',
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 600000,
    },
    name: 'user',
}));

//uploads 파일이 없으면 생성.
try{
    fs.readdirSync('./uploads');
}catch (err){
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

// 라우터들
app.use('/', mainRouter);

app.use('/', loginRouter);

app.use('/', articleRouter);

app.use('/', photoRouter);

// 404
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// 에러
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('error');
});

//3000번 포트로 서버 띄우기
app.listen(3000, ()=>{
    console.log("3000번 대기중");
});