// Предполагаем, что movies.js уже подключён, значит массив movies доступен

// Элементы на странице watchlist.html
const watchlistUl = document.getElementById('watchlistMovies');

// Берём watchList из localStorage
function getWatchList() {
  const watchList = localStorage.getItem('watchList');
  return watchList ? JSON.parse(watchList) : [];
}

// Сохраняем watchList
function saveWatchList(watchListArray) {
  localStorage.setItem('watchList', JSON.stringify(watchListArray));
}

// Удаляем из watchList
function removeFromWatchList(movieTitle) {
  let watchList = getWatchList();
  watchList = watchList.filter(title => title !== movieTitle);
  saveWatchList(watchList);
}

// Функция отрисовки списка фильмов, добавленных в watchList
function displayWatchList() {
  watchlistUl.innerHTML = '';
  
  const watchListTitles = getWatchList();

  // Фильтруем массив movies, чтобы оставить только те, что в watchList
  const watchListMovies = movies.filter(movie => watchListTitles.includes(movie.title));

  watchListMovies.forEach(movie => {
    const li = document.createElement('li');
    li.classList.add('movie-item');
    
    // При клике - переход на плеер
    li.onclick = () => {
      window.location.href = `player.html?movie=${encodeURIComponent(movie.url)}`;
    };
    
    const posterDiv = document.createElement('div');
    posterDiv.classList.add('movie-poster');
    posterDiv.style.backgroundImage = `url(${movie.poster})`;

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('movie-title');
    titleDiv.textContent = movie.title;
    
    // Кнопка удаления
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('movie-actions');

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('watchlist-btn');
    removeBtn.textContent = "Удалить из списка";
    removeBtn.addEventListener('click', (event) => {
      event.stopPropagation(); // чтобы не срабатывать переход
      removeFromWatchList(movie.title);
      displayWatchList(); // Обновим отображение
    });
    
    actionsDiv.appendChild(removeBtn);

    li.appendChild(posterDiv);
    li.appendChild(titleDiv);
    li.appendChild(actionsDiv);

    watchlistUl.appendChild(li);
  });
}

// При загрузке сразу выводим список
displayWatchList();
