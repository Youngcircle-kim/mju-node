export const getLoginController = (req, res) =>{

    // session.id가 있으면 로그인이 됐다는 의미에서 /로 보내버림
    if (req.session.user){
        res.redirect('/');
    }
    else{
        const title = '사용자 로그인';
        const isNotLogin = true;
        res.render('login.ejs', { title, isNotLogin });
    }
}

export const postLoginController = (req, res) =>{

    // 프론트에서 받아온 이름을 세션에 등록
    const { name } = req.body;
    req.session.user = name;

    res.redirect('/');
}