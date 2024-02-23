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
  const reponse = await fetch(url);
  console.log('rrr', reponse);
  const data = await reponse.json();
  newsList = data.articles;
  console.log('ddd', newsList);

  render();
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
    searchInput.focus();
    searchInput.value = '';
    searchIcon.style.display = 'none';

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
  setTimeout (() => {
    // #search-input이 포커스를 잃으면 input 영역을 숨기고 mobile-gnb-btn을 보이게 함
  inputArea.style.display = 'none';
  searchIcon.style.display = 'block';
  },600)
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
}

getLatesNews();

// 1. 버튼들에 클릭 이벤트 // const getNewsByCategory
// 2. 카테고리 별 뉴스 가져오기
// 3. 그 뉴스를 보여주기