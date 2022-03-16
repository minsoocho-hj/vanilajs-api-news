const newsSection = document.querySelector(".news-section");
const newsCard = document.querySelector(".news-card");
const newsTitle = document.querySelector(".news-card-title");
const newsImg = document.querySelector(".img-size");
const newsContent = document.querySelector(".news-content");
const newsDate = document.querySelector(".news-date");
const newsCategoryEl = document.querySelectorAll(".news-category");
const searchForm = document.querySelector(".search-form");
const searchBtn = document.querySelector(".search-btn");
let url = "";
let news = [];
let newsHtml = "";
let newsCategory = "news";

newsCategoryEl.forEach((category) =>
  category.addEventListener("click", (e) => getNewsByTopic(e))
);

const getNewsAPI = async () => {
  try {
    let header = new Headers({
      "x-api-key": "_xSo-RuaJr7h2nLEeovr-XcADqeARsh3a9SoltgV76g",
    });
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        renderError("No result");
      }
      news = data.articles;
      renderNews();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    renderError(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=news&page_size=10`
  );
  getNewsAPI();
};

getLatestNews();

const getNewsByTopic = async (e) => {
  news = [];
  let topic = e.target.innerText.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=${topic}&page_size=10`
  );
  getNewsAPI();
};

const getNewsBySearch = async (e) => {
  e.preventDefault();
  news = [];
  let keyword = searchForm.value.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=US&page_size=10`
  );
  getNewsAPI();
};

const renderNews = async () => {
  let newsHtml = "";
  news.forEach((article) => {
    let articleTitle = article.title;
    let articleDate = article.published_date;
    let articleLink = article.link;
    let articleImg = article.media;
    let articleRights = article.rights;
    let articleSummary = article.summary;

    if (articleSummary) {
      if (articleSummary.length > 200) {
        articleSummary = articleSummary.substr(0, 300) + "...";
      } else {
        articleSummary;
      }
    } else {
      articleSummary = "No content";
    }

    newsHtml += `<div class="row news-card">
                <div class="col-lg-4 news-img">
                  <img alt="image" class="img-size" src="${
                    articleImg ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
                  }" />
                </div>
                <div class="col-lg-8 news-info">
                  <h2 class="news-card-title"><a href="${articleLink}" target="_blank" >${articleTitle}</a></h2>
                  <p class="news-content">
                  ${articleSummary}
                  </p>
                  <div>
                  ${articleRights || "no source"} - ${moment(
      articleDate
    ).fromNow()}
                  </div>
                </div>
              </div>`;
  });
  newsSection.innerHTML = newsHtml;
};

const renderError = (error) => {
  let errorHtml = `<div class="alert alert-danger text-center" role="alert">
  ${error}
</div>`;
  newsSection.innerHTML = errorHtml;
};

searchBtn.addEventListener("click", getNewsBySearch);
