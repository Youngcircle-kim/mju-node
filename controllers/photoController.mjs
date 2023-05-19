
export const getPhotoController = (req, res) => {
    // 세션에 담긴 데이터 추출 후 렌더링.
    const { user, isUploaded, files} = req.session;
    console.log(req.session);
    //로그인이 안됐을 때
    if (!user){
        const title = '기사 사진 등록';
        const isLogin = false;
        console.log(files);
        res.render('photo.ejs', { title, isUploaded, files, isLogin });
    }
    //로그인 됐을 때
    else{
        const title = '기사 사진 등록';
        const name = req.session.user;
        const isLogin = true;
        res.render('photo.ejs', { title, name, isUploaded, files, isLogin });
    }
}

export const postPhotoController = (req, res) =>{
    //세션에 데이터 등록 후 리다리렉트
    console.log(req.files);
    req.session.isUploaded = true;
    req.session.files = req.files;

    res.redirect("/photo");
}