const API_KEY = `59db89f3fab8455081d13257e11ce5d2`;
let newsList = [];
const inputArea = document.getElementById('input-area');
const searchIcon = document.getElementById('search-icon');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn'); // 검색 버튼 추가

const menus = document.querySelectorAll('.menus button');
// console.log('button :', menus); // 버튼들 확인
const mobileMenus = document.querySelectorAll('#menu-list button')
console.log('button :', mobileMenus); // 버튼들 확인

let url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`)

// 페이지네이션 값 정하기
let totalResults = 0; // 기본값 = 0; 전역 변수 선언
// 임의적으로 정해줄 수 있음
let page = 1;
const pageSize = 10; // 고정 값
const groupSize = 5; // 고정 값
// 임의적으로 정해줄 수 있음

// 모바일 햄버거 메뉴열기
const openNav = () => {
  document.getElementById("mySidenav").style.width = "250px";
};

// 모바일 햄버거 메뉴닫기
const closeNav = () => {
  document.getElementById("mySidenav").style.width = "0";
};

mobileMenus.forEach(menu => menu.addEventListener('click', (evt) => getNewsByCategory(evt)));

menus.forEach(menu => menu.addEventListener('click', (evt) => getNewsByCategory(evt)));

const getNews = async () => {
  try {
    url.searchParams.set('page', page); // => &page=page
    url.searchParams.set('pageSize', pageSize); // => &pageSize=pageSize
    // url 뒤에다 붙여줄 수 있는 함수 = searchParams

    // fetch 전 세팅 후 fetch

    const response = await fetch(url);
    // console.log('rrr', reponse);
    const data = await response.json();
    if (response.status === 200) { // 정상일 경우 렌더링
      if (data.articles.length === 0) { // 정상이지만 검색 후 article 갯수가 0개 일 때
        throw new Error(`현재 검색하신 기사의 갯수는 0개 입니다.`);
      }
      newsList = data.articles;
      totalResults = data.totalResults
      console.log('ddd', newsList); // 데이터 정상 여부 확인
      render();
      paginationRender();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    // console.log('error', error.message); // 트라이캐치 함수가 정상여부 확인
    errorRender(error.message);
  };

}

const getLatesNews = async () => {
  url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${API_KEY}`);
  getNews();
};

const getNewsByCategory = async (evt) => {
  const category = evt.target.textContent.toLowerCase();
  console.log('category', category); // 카테고리 클릭 이벤트 확인
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&category=${category}&apiKey=${API_KEY}`
  );
  getNews();
};

// 검색 돋보기 버튼을 누르면 -> search에 display 이벤트 처리
const openSearchBox = () => {
  if (inputArea.style.display === 'flex') {
    inputArea.style.display = 'none';
  } else {
    inputArea.style.display = 'flex';
    searchIcon.style.display = 'none';
    searchInput.focus();
    searchInput.value = '';
  }
};

// 검색 입력창에 엔터 키 이벤트 추가
searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    // 엔터 키를 누르면 검색 실행
    handleSearch();
  }
});

// 검색 버튼 클릭 이벤트 추가
searchBtn.addEventListener('click', () => {
  // 검색 버튼을 누르면 검색 실행
  handleSearch();
});

// ESC 키를 눌렀을 때 검색창 닫기
document.addEventListener('keyup', (event) => {
  if (event.key === 'Escape') {
    inputArea.style.display = 'none';
    searchIcon.style.display = 'block';
  }
});

// #search-input에서 포커스가 해제될 때 이벤트 처리
searchInput.addEventListener('blur', () => {
  setTimeout(() => {
    // #search-input이 포커스를 잃으면 input 영역을 숨기고 mobile-gnb-btn을 보이게 함
    inputArea.style.display = 'none';
    searchIcon.style.display = 'block';
  }, 600)
});


// 키워드로 뉴스 가져오기
const getNewsByKeyword = async () => {
  const keyword = searchInput.value;
  console.log('keyword', keyword);
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=kr&q=${keyword}&apiKey=${API_KEY}`
  );
  getNews();
};

// handleSearch() 함수 추가
const handleSearch = () => {
  // 검색 이벤트를 통합적으로 처리
  getNewsByKeyword();
};

const render = () => {
  const newsHTML = newsList.map(
    (news) =>
    `
    <div class="row news mx-auto">
    <div class="news-img col-lg-4 col-12 mx-auto">
      <img class="img-fluid mx-auto col-12" src="${news.urlToImage ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
      }" alt="뉴스 img">
    </div>
    <div class="col-lg-8">
      <h2 class="content-title">${news.title}</h2>
      <p class="content-txt">${news.description == null || news.description == ""
          ? "내용없음"
          : news.description.length > 200
          ? news.description.substring(0, 200) + "..."
          : news.description
    }</p>
      <div class="content-created">${news.source.name} * ${news.publishedAt|| "no source"}  ${moment(
        news.published_date
      ).fromNow()}</div>
    </div>
  </div>
  `
  ).join('');

  // console.log('html', newsHTML); // html 확인

  document.getElementById('news-board').innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `
  <div class="alert alert-danger text-center" role="alert">
  ${errorMessage}
</div>`;

  document.getElementById('news-board').innerHTML = errorHTML;
};

// pagination 구성
const paginationRender = () => {
  // totalResults
  // let totalResults = 0; // 기본값 = 0; 전역 변수 선언
  // 임의적으로 정해줄 수 있음
  // page
  // let page = 1;
  // pageSize
  // const pageSize = 10; // 고정 값
  // groupSize
  // const groupSize = 5; // 고정 값
  // 임의적으로 정해줄 수 있음
  // totalapages
  const totalPages = Math.ceil(totalResults / pageSize);
  // pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  // lastPage
  let lastPage = pageGroup * groupSize;
  // 마지막페이지가 그룹사이즈보다 작을 경우 -> lastpage = totalpage
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }
  // firstPage
  const firstPage = lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1); // 첫번째 페이지그룹이 <=0 일 경우

  // first ~ last Page 그려주기
  let paginationHTML = `<li class="page-item" onclick="moveToPage(${page - 1})"><a class="page-link">prev</a></li>`
  for (let i = firstPage; i <= lastPage; i++) {
    // active 상태 추가
    paginationHTML += `<li class="page-item ${i === page ? 'active' : ''} onclick='moveToPage(${i})'"><a class="page-link">${i}</a></li>`
  }
  paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})"><a class="page-link">next</a></li>`;
  document.querySelector('.pagination').innerHTML = paginationHTML;

  //   <div arialabel='Page navigation exmple'>
  //   <ul class='pagination'>
  //   <li class="page-item"><a href="#" class="page-link">prev</a></li>
  //       <li class="page-item"><a href="#" class="page-link">1</a></li>
  //       <li class="page-item"><a href="#" class="page-link">2</a></li>
  //       <li class="page-item"><a href="#" class="page-link">3</a></li>
  //       <li class="page-item"><a href="#" class="page-link">4</a></li>
  //       <li class="page-item"><a href="#" class="page-link">5</a></li>
  //       <li class="page-item"><a href="#" class="page-link">next</a></li>
  //   </ul>
  // </div>
}

const moveToPage = (pageNum) => {
  console.log('movetopage', pageNum);
  page = pageNum;
  getNews();
}

getLatesNews();

// 1. 버튼들에 클릭 이벤트 // const getNewsByCategory
// 2. 카테고리 별 뉴스 가져오기
// 3. 그 뉴스를 보여주기