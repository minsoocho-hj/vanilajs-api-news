const newsSection = document.querySelector(".news-section");
const newsCategory = document.querySelectorAll(".news-category");
const searchInput = document.querySelector(".search-form");
const searchInputBtn = document.querySelector(".search-btn");
const paginationUl = document.querySelector(".pagination");

let news = [];
let url;
let errorMessage = "";
let totalPages = 1;
let page = 1;
let pageSize = 1;

const fetchAPI = () => {
  url.searchParams.set("page", page);
  console.log(url);
  fetch(url, {
    headers: {
      "x-api-key": "16Hyli3X6_8cPXeBjiKJfaS7cuqxqUy-_s0dxlSC9tg",
      "Content-Type": "application/json",
    },
  })
    .then((resp) => resp.json())
    .then(function (data) {
      news = data.articles;
      if (data.status == "ok") {
        totalPages = data.total_pages;
        page = data.page;

        renderNews();
        renderPagination();
      } else {
        renderError(data.status);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};

const getNews = () => {
  url = new URL(
    "https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=news&page_size=10"
  );
  fetchAPI();
};

getNews();

const getNewsByTopic = (e) => {
  let topic = e.target.innerText.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=${topic}&page_size=10`
  );
  fetchAPI();
};

const getNewsByKeyword = (e) => {
  e.preventDefault();
  let keyword = searchInput.value;
  console.log(keyword);
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=US&page_size=10`
  );
  fetchAPI();
};

const renderNews = () => {
  let newsHTML = "";
  news.forEach((article) => {
    let articleTitle = article.title;
    let articleLink = article.link;
    let articleImg = article.media;
    let articleRights = article.rights;
    let articleDate = article.published_date;
    let articleSummary = article.summary;

    newsHTML += `<div class="row news-card">
                    <div class="col-lg-4 news-img">
                    <img alt="image" class="img-size" src="${
                      articleImg ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
                    }" alt="News image"/>
                    </div>
                    <div class="col-lg-8 news-info">
                      <h2 class="news-card-title"><a href="${articleLink}" target="_blank" >${articleTitle}</a></h2>
                      <p class="news-content">${
                        articleSummary == null || articleSummary == ""
                          ? "No content"
                          : articleSummary.length > 200
                          ? articleSummary.substr(0, 300) + "..."
                          : articleSummary
                      }</p>
                      <div>${articleRights || "no source"} - ${moment(
      articleDate
    ).fromNow()} </div>
                  </div>
                </div>`;
  });
  newsSection.innerHTML = newsHTML;
};

const renderError = (errorMessage) => {
  let errorHTML = "";
  errorHTML += `<div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`;
  newsSection.innerHTML = errorHTML;
};

const renderPagination = () => {
  let pageHTML = "";
  let pageGroup = Math.ceil(page / 5);
  let lastPage = pageGroup * 5;
  let firstPage = lastPage - 4;

  if (firstPage >= 6) {
    pageHTML = `<li class="page-item">
                <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(1)">
                <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
                  page - 1
                })">
                <span aria-hidden="true">&lt;</span>
                </a>
              </li>`;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    pageHTML += `<li class="page-item ${
      page == i ? "active" : ""
    }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }

  if (lastPage < totalPages) {
    pageHTML += `<li class="page-item">
                <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
                  page + 1
                })">
                <span aria-hidden="true">&gt;</span>
                </a>
              </li>
              <li class="page-item">
                <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${totalPages})">
                <span aria-hidden="true">&raquo;</span>
                </a>
              </li>`;
  }

  paginationUl.innerHTML = pageHTML;
};

newsCategory.forEach((category) => {
  category.addEventListener("click", getNewsByTopic);
});

const moveToPage = (pageNum) => {
  console.log("move");
  page = pageNum;
  console.log(page);
  getNews();
};
searchInputBtn.addEventListener("click", getNewsByKeyword);
