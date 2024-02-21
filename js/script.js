const API_KEY = ``;
let news = [];
const getLatesNews = async () => {
  const url = new URL(
    ``
  );
  const reponse = await fetch(url);
  console.log('rrr', reponse);
  const data = await reponse.json();
  news = data.articles;
  console.log('ddd', news);
}