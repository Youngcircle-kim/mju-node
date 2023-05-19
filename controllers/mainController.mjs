export const getMainController = (req, res)=>{

    // 만약 로그인이 안돼있는 상태면 /login 으로 보내버림
    console.log("getMainController", req.session.user);
    const { user } = req.session;
    if (!user){
        res.redirect('/login');
    }else{
        // 로그인 상태이면 session 에서 name 받아서 렌더링
        const name = req.session.user;
        const title = '사용자 로그인';
        const isNotLogin = false;
        res.render('login.ejs', { title, isNotLogin, name });
    }
}