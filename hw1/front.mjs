// 고급웹프로그래밍(6084) 과제 #1 김영환 60221304

// article page 버튼 분류를 위한 let 변수
let clickType;
//search 버튼이 눌렸을 떄
async function searchBtn() {
    clickType = "search";
}
// edit 버튼이 눌렸을 떄
async function editBtn() {
    clickType = "edit";
}
// delete 버튼이 눌렸을 때
async function deleteBtn() {
    clickType = "delete";
}
async function getUser() {
    // 로딩 시 사용자 가져오는 함수
    try {
        const res = await axios.get('/users');
        const users = res.data;
        const p = document.getElementById('p-name');

        // 사용자마다 반복적으로 화면 표시 및 이벤트 연결
        Object.keys(users).map(function (key) {
            p.innerText = users[key];
        });

    } catch (err) {
        console.error(err);
    }
}

async function getAllArticle(){
    // 전체 기사 보기 버튼 클릭 시 기사를 가져오는 함수
    try {
        const articles  = await axios.get('/articles');
        const data = articles.data;
        console.log(articles.data);
        const list = document.getElementById('list');
        list.innerText = '';

        // 만약 기사가 떠 있을 떄를 대비해, 뜬 기사 삭제
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        let size = Object.keys(data).length+1
        // /articles에 있는 기사 하나 하나당 li로 추가
        for (let i = 1; i < size; i++) {
            //삭제 후 기사들을 봤을 떄 undefined 뜨는거 방지
            if (data[i] === undefined){
                size++;
            }else{
                const li = document.createElement('li');
                li.innerText = data[i];
                list.appendChild(li);
            }
        }

    }catch (err) {
        console.error(err)
    }
}
async function getArticle(number) {
    // 검색 버튼을 누르면 해당 번호의 기사만 가져오는 함수
    try{
        console.log(number);
        const list = document.getElementById('list')
        list.innerText = '';

        // 원하는 기사 번호의 해당하는 기사 찾기
        const article = await axios.get('/article/'+ String(number));

        // 기사 생성
        const li = document.createElement('li');
        li.innerText = article.data;

        list.appendChild(li);


    } catch (err) {
        console.error(err);
    }
}
async function editArticle(number){
    // 수정 버튼을 누르면 해당 번호의 값을 수정하는 함수.

    const title = prompt('바꿀 기사 내용을 입력하세요');
    if (!title) {
        return alert('내용을 반드시 입력하셔야 합니다');
    }
    try {
        // put 요청을 보냄
        await axios.put('/article/' + String(number), { title });
    } catch (err) {
        console.error(err);
    }
}
async function deleteArticle(number){
    try {
        // delete 요청을 보냄
        await axios.delete('/user/' + String(number));
    } catch (err) {
        console.error(err);
    }
}
window.onload = getUser();

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
            location.href = '/article'
            await getUser();
        } catch (err) {
            console.error(err);
        }
        e.target.name.value = '';
    });
}

else if(document.getElementById('add-article') && document.getElementById('option')){
    //기사 등록 폼 제출시 실행
    document.getElementById('add-article').addEventListener('submit', async e =>{
        e.preventDefault();
        const article = e.target.title.value;
        console.log(article);
        if (!article) {
            return alert('기사 제목을 입력하세요.');
        }
        try {
            // ajax 요청을 /newArticle에게 기사 정보를 post로 보냄.
            await axios.post('/newArticle', { article });
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
        console.log(clickType);
        if (!title_number){
            return alert('기사 번호를 입력해주세요.')
        }
        try{
            // 각각의 버튼을 눌렀을 때 마다 다른 기능을 하도록 조건문으로 걸러냄.
            if (clickType === "search"){
                await getArticle(title_number);
            } else if (clickType === "edit"){
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
