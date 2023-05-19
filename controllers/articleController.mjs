import fs from 'fs/promises';
import path from "path";

const __dirname = path.resolve();

export const getArticleController = async (req, res) => {

    //article.json 파일 읽어오고 article 이라는 json 객체 만들어서 저장.
    const jsonFile = await fs.readFile(__dirname+'/model/article.json', 'utf8');
    const article = JSON.parse(jsonFile);

    // 제이슨 파일에 null, '', undefined 필터링
    const filteredArticle = article.filter(function(obj){
        return obj !== null && obj !== undefined && obj !== '';
    });

    const { user } = req.session;
    // 만약 로그인이 안돼있는 상태면 환영문구 없이 렌더링.
    if (!user){
        const title = '기사 등록';
        const isLogin = false;
        const data = filteredArticle;
        res.render('article.ejs', { title, isLogin, data });
    }
    // 로그인 했으면 바로 있는 데이터들로 렌더링.
    else{
        const title = '기사 등록';
        const name = req.session.user;
        const isLogin = true;
        const data = filteredArticle;
        res.render('article.ejs', { title, name, isLogin, data });
    }
};

export const postArticleController = async (req, res) =>{
    //article.json 파일 읽어오고 article이라는 json 객체 만들어서 저장.
    const jsonFile = await fs.readFile(__dirname+'/model/article.json', 'utf8');
    const article = JSON.parse(jsonFile);

    // 제이슨 파일에 null, '', undefined 필터링
    const filteredArticle = article.filter(function(obj){
        return obj !== null && obj !== undefined && obj !== '';
    });
    //프론트에서 받은 데이터를 article 객체에 추가하고 리다이렉트로 페이지 리렌더링
    const title = req.body.article;
    // 첫번째 데이터면 인덱스 로직이 작동을 안하기 때문에 따로 처리한다.
    if (filteredArticle.length ===0){
        filteredArticle.push(
            {
                "index": 1,
                "title": title
            }
        );
    } else {
        filteredArticle.push(
            {
                "index": Number(filteredArticle[filteredArticle.length-1].index)+1,
                "title": title
            }
        );
    }
    // 파일 씀
    await fs.writeFile(__dirname+'/model/article.json',JSON.stringify(filteredArticle), 'utf8');

    // 성공했다고 보냄.
    res.send({
        "result": "success"
    });
};

export const putArticleController = async (req, res) =>{
    //article.json 파일 읽어오고 article이라는 json 객체 만들어서 저장.
    const jsonFile = await fs.readFile(__dirname+'/model/article.json', 'utf8');
    const article = JSON.parse(jsonFile);

    // 제이슨 파일에 null, '', undefined 필터링
    const filteredArticle = article.filter(function(obj){
        return obj !== null && obj !== undefined && obj !== '';
    });

    // 프론트에서 바꿀려는 기사 번호와 바꾼 제목을 받아서 article 객체를 수정하고, 리렌더링
    const { title_number, title } = req.body;

    // for 문으로 원하는 해당하는 인덱스 값 알아채고, 그 위치의 기사 제목 덮어씀.
    for (let i = 0; i < filteredArticle.length; i++) {
        if (Number(filteredArticle[i].index) === Number(title_number)){
            filteredArticle[i].title = title;
        }
    }

    // 파일 덮어씀.
    await fs.writeFile(__dirname + '/model/article.json', JSON.stringify(article), 'utf8',);

    // 성공했다고 보냄.
    res.send({
        "result": "success"
    });
}

export const deleteArticleController = async (req, res)=>{

    //article.json 파일 읽어오고 article 이라는 json 객체 만들어서 저장.
    const jsonFile = await fs.readFile(__dirname+'/model/article.json', 'utf8');
    const article = JSON.parse(jsonFile);

    // 제이슨 파일에 null, '', undefined 필터링
    const filteredArticle = article.filter(function(obj){
        return obj !== null && obj !== undefined && obj !== '';
    });

    const { title_number } = req.body;
    // for 문으로 원하는 해당하는 인덱스 값 알아채고, 그 위치의 기사 제목, 번호 삭제.
    for (let i = 0; i < filteredArticle.length; i++) {
        if (Number(filteredArticle[i]?.index) === Number(title_number)){
            delete filteredArticle[i];
            break;
        }
    }

    // 지운 데이터를 다시 덮어씀.
    await fs.writeFile(__dirname + '/model/article.json', JSON.stringify(filteredArticle), 'utf8');

    // 성공했다고 보냄.
    res.send({
        "result": "success"
    });

}