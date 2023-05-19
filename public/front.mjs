// article page 버튼 분류를 위한 let 변수
let clickType;
// edit 버튼이 눌렸을 떄
async function editBtn() {
    clickType = "edit";
}
// delete 버튼이 눌렸을 때
async function deleteBtn() {
    clickType = "delete";
}
async function editArticle(number){
    // 수정 버튼을 누르면 해당 번호의 값을 수정하는 함수.
    const title = prompt('바꿀 기사 내용을 입력하세요');
    if (!title) {
        return alert('내용을 반드시 입력하셔야 합니다');
    }
    try {
        console.log("나 여기");
        // put 요청을 보냄
        await axios.put('/article', { title_number: number ,title });
        location.href='/article';
    } catch (err) {
        console.error(err);
    }
}
async function deleteArticle(number){
    try {
        // delete 요청을 보냄
        await axios.delete('/article',{data:{title_number: number}});
        location.href='/article';
    } catch (err) {
        console.error(err);
    }
}
// 로그인 폼 제출(submit) 시 실행
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', async e => {
        e.preventDefault();
        const name = e.target.name.value;
        if (!name) {
            return alert('이름을 입력하세요');
        }
        try {
            // ajax요청을 /user에게 name데이터를 post로 보냄
            await axios.post('/user', {name});
            location.href = '/'
        } catch (err) {
            console.error(err);
        }
        e.target.name.value = '';
    });
} else if(document.getElementById('article') && document.getElementById('option') ){
    //기사 등록 폼 제출시 실행
    document.getElementById('article').addEventListener('submit', async e =>{
        e.preventDefault();
        const article = e.target.title.value;
        console.log(article);
        if (!article) {
            return alert('기사 제목을 입력하세요.');
        }
        try {
            // ajax 요청을 /article 에게 기사 정보를 post로 보냄.
            await axios.post('/article', { article });
            location.href = '/article'
        } catch (err) {
            console.error(err);
        }
        e.target.title.value = '';
    });
    //검색 수정 삭제 버튼이 눌리면 실행
    document.getElementById('option').addEventListener('submit', async e =>{
        e.preventDefault();
        const title_number = e.target.title_number.value;
        if (!title_number){
            return alert('기사 번호를 입력해주세요.')
        }
        try{
            // 각각의 버튼을 눌렀을 때 마다 다른 기능을 하도록 조건문으로 걸러냄.
            if (clickType === "edit"){
                await editArticle(title_number);
            } else if (clickType === "delete"){
                await deleteArticle(title_number);
            }
        } catch (err){
            console.error(err);
        }
        e.target.title_number.value = '';
    })
}