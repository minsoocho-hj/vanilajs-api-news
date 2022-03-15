const newsTitle = document.querySelector;

let news = [];
const getLatestNews = async () => {
  let url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=business&page_size=10`
  );
  //url분석함.
  let header = new Headers({
    "x-api-key": "_xSo-RuaJr7h2nLEeovr-XcADqeARsh3a9SoltgV76g",
  });
  let response = await fetch(url, { headers: header });
  let data = await response.json();
  news = data.articles;
  console.log(news);
};

getLatestNews();
