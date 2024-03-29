// 고급웹프로그래밍(6084) 과제 #1 김영환 60221304

import http from 'http';
import fs from 'fs/promises'

// memory repository
let users ={};
let articles = {
    "1" : "OpenAI, GPT-4 출시",
    "2" : "GPT-4 이용 횟수 제한...",
    "3" : "ChatGPT 탑재 MS Office",
    "4" : "ChatGPT vs. Bard vs. Bing",
};
// 삽입 할 때, 인덱스 위해 더미 인덱스 4 지정
let index = Object.keys(articles).length;
// 쿠카 문자열을 자바스크립트 객체로 변환하는 함수
const parseCookies = (cookie = '') =>
    cookie
        .split(';')
        .map(v => v.split('='))
        .reduce((acc, [k, v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});

http.createServer(async (req, res)=>{
    try{
        // 먼저 저장되어있는 쿠키가 있는지 없는지 검사
        const cookies = parseCookies(req.headers.cookie); // 변환 -> { mycookie: 'test' }
        if (req.method === 'GET'){
            console.log(`req.url : ${req.url}`);
            if (req.url === '/') {
                if (cookies.name) {
                    try {
                        const data = await fs.readFile('./article.html');
                        res.writeHead(302, {Location: '/article' }, { 'Content-Type': 'text/html; charset=utf-8' });
                        return res.end(data);
                    } catch (err) {
                        console.error(err)
                    }
                } else if (users.name){
                    const name  = users.name;

                    // 쿠키 유효 시간을 현재시간 + 5분으로 설정
                    const expires = new Date();
                    expires.setMinutes(expires.getMinutes() + 5);

                    res.writeHead(302, {
                        Location: '/',
                        // HttpOnly는 자바스크립트로 쿠키에 접근할 수 없게 한다. 보안을 위해.
                        'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
                    });
                    res.end();

                    //로그인이 안되어 있는 경우
                }else {
                    try{
                        const data = await fs.readFile('./login.html');
                        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                        return res.end(data);
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
            else if(req.url === '/article'){
                //로그인이 된 경우
                if (cookies.name) {
                    try {
                        const data = await fs.readFile('./article.html');
                        res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
                        return res.end(data);
                    } catch (err) {
                        console.error(err)
                    }
                    // login이 되어 users 객체에 값이 저장된 경우 동작한다.
                } else if (users.name){
                    const name  = users.name;

                    // 쿠키 유효 시간을 현재시간 + 5분으로 설정
                    const expires = new Date();
                    expires.setMinutes(expires.getMinutes() + 5);

                    res.writeHead(302, {
                        Location: '/article',
                        // HttpOnly는 자바스크립트로 쿠키에 접근할 수 없게 한다. 보안을 위해.
                        'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/article`,
                    });
                    res.end();
                    //로그인이 안되어 있는 경우
                }else {
                    try{
                        // login 페이지로 넘어감
                        const data = await fs.readFile('./login.html');
                        res.writeHead(302, {Location: '/' }, { 'Content-Type': 'text/html; charset=utf-8' });
                        return res.end(data);
                    } catch (err) {
                        console.error(err)
                    }
                }
            } else if(req.url ==='/users'){
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                return res.end(JSON.stringify(users));
            } else if(req.url ==='/articles'){
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                return res.end(JSON.stringify(articles));
            } else if(req.url.startsWith('/article/')){
                const key = req.url.split('/')[2];
                console.log('검색 버튼 클릭');
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                return res.end(JSON.stringify(articles[key]));
            } else{
                try{
                    const data = await fs.readFile(`.${req.url}`);
                    res.end(data);
                } catch (error){
                    console.error(error);
                    res.writeHead(404,{'Content-Type': 'text/plain; charset=utf-8'})
                }
            }
        } else if(req.method === 'POST'){
            if (req.url === '/user') {
                let body1 = '';
                // 요청의 body1를 stream 형식으로 받음
                req.on('data', data => {
                    body1 += data;
                });
                // 요청의 body1를 다 받은 후 실행됨
                return req.on('end', () => {
                    console.log('POST 본문(Body):', body1);
                    const { name } = JSON.parse(body1); // { name } 형식으로 보냈으니 구조분해
                    const id = "name";
                    users[id] = name;
                    console.log(users);
                    res.writeHead(201, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('ok');
                });
            } else if (req.url === '/newArticle'){
                let body2 = '';
                // 요청의 body2를 stream 형식으로 받음
                req.on('data', data => {
                    body2 += data;
                });
                // 요청의 body2를 다 받은 후 실행됨
                return req.on('end', () => {
                    console.log('POST 본문(Body):', body2);
                    const { article } = JSON.parse(body2); // { name } 형식으로 보냈으니 구조분해
                    index += 1; //추가니 index+1 값으로 객체 저장
                    articles[index] = article;
                    console.log(articles);
                    res.writeHead(201, { 'Content-Type': 'text/plain; charset=utf-8' });
                    res.end('ok');
                });
            }
        } else if (req.method === 'PUT'){
            if (req.url.startsWith('/article/')){
                // 기사 제목을 수정하는 부분.
                const key = req.url.split('/')[2];
                let body = '';
                req.on('data', data => {
                    body += data;
                });
                // 요청의 body를 다 받은 뒤 실행.
                return req.on('end', () => {
                    console.log('PUT 본문(Body):', body);
                    articles[key] = JSON.parse(body).title;
                    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                    return res.end('ok');
                });
            }
        } else if (req.method === "DELETE"){
            if (req.url.startsWith('/user/')) {
                // delete 요청이 들어오면 해당 번호에 맞는 기사 삭제하는 부분.
                const key = req.url.split('/')[2];
                // 삭제를 원하는 값을 지운다.
                delete articles[key];

                res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
                return res.end('ok');
            }
        }
    } catch (error) {
        console.error(error);
        res.write(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(error.message);
    }
})
    .listen(3000, ()=>{
        console.log('3000번 포트 대기중');
    })
