// Предполагается, что файл movies.js уже загружен и переменная movies доступна.

// --------------------------
// Watch List Logic
// --------------------------
function getWatchList() {
  const watchList = localStorage.getItem('watchList');
  return watchList ? JSON.parse(watchList) : [];
}

function saveWatchList(watchListArray) {
  localStorage.setItem('watchList', JSON.stringify(watchListArray));
}

function isInWatchList(movieTitle) {
  const watchList = getWatchList();
  return watchList.includes(movieTitle);
}

function addToWatchList(movieTitle) {
  const watchList = getWatchList();
  if (!watchList.includes(movieTitle)) {
    watchList.push(movieTitle);
    saveWatchList(watchList);
  }
}

function removeFromWatchList(movieTitle) {
  let watchList = getWatchList();
  watchList = watchList.filter(title => title !== movieTitle);
  saveWatchList(watchList);
}

// --------------------------
// Основной код
// --------------------------
const searchBar = document.getElementById('searchBar');
const movieList = document.getElementById('movieList');
const genreFilter = document.getElementById('genreFilter');
const yearFilter = document.getElementById('yearFilter');
const ratingFilter = document.getElementById('ratingFilter');

// Функция для получения уникальных значений из массива
function getUniqueValues(array, key) {
  return [...new Set(array.map(item => item[key]))];
}

// Заполняем фильтры уникальными значениями
function populateFilters() {
  // Жанры
  const genres = getUniqueValues(movies, 'genre');
  genres.sort().forEach(genre => {
    const option = document.createElement('option');
    option.value = genre;
    option.textContent = genre;
    genreFilter.appendChild(option);
  });

  // Годы
  const years = getUniqueValues(movies, 'releaseDate');
  years.sort().forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearFilter.appendChild(option);
  });
}

// Функция для отображения списка фильмов с учётом фильтров
function displayMovies() {
  movieList.innerHTML = ''; // Очищаем список

  const filterText = searchBar.value.toLowerCase();
  const selectedGenre = genreFilter.value;
  const selectedYear = yearFilter.value;
  const selectedRating = ratingFilter.value;

  movies
    .filter(movie => {
      const matchesText = movie.title.toLowerCase().includes(filterText);
      const matchesGenre = selectedGenre ? movie.genre === selectedGenre : true;
      const matchesYear = selectedYear ? movie.releaseDate === selectedYear : true;
      const matchesRating = selectedRating ? movie.rating >= parseFloat(selectedRating) : true;
      return matchesText && matchesGenre && matchesYear && matchesRating;
    })
    .forEach((movie, index) => {
      const li = document.createElement('li');
      li.classList.add('movie-item');
      li.style.animationDelay = `${index * 0.1}s`;

      // По клику на карточку - переходим на player.html
      li.onclick = () => {
        window.location.href = `player.html?movie=${encodeURIComponent(movie.url)}`;
      };

      const posterDiv = document.createElement('div');
      posterDiv.classList.add('movie-poster');
      posterDiv.style.backgroundImage = `url(${movie.poster})`;

      const titleDiv = document.createElement('div');
      titleDiv.classList.add('movie-title');
      titleDiv.textContent = movie.title;

      // --- Watchlist button / actions ---
      const actionsDiv = document.createElement('div');
      actionsDiv.classList.add('movie-actions');

      const watchListButton = document.createElement('button');
      watchListButton.classList.add('watchlist-btn');

      // Проверяем, есть ли фильм в watchList
      if (isInWatchList(movie.title)) {
        watchListButton.textContent = "Удалить из списка";
        watchListButton.addEventListener('click', (event) => {
          event.stopPropagation(); // чтобы не переходить на плеер
          removeFromWatchList(movie.title);
          displayMovies(); // Обновим список
        });
      } else {
        watchListButton.textContent = "Добавить в список";
        watchListButton.addEventListener('click', (event) => {
          event.stopPropagation();
          addToWatchList(movie.title);
          displayMovies();
        });
      }

      actionsDiv.appendChild(watchListButton);

      // Добавляем всё в li
      li.appendChild(posterDiv);
      li.appendChild(titleDiv);
      li.appendChild(actionsDiv);

      movieList.appendChild(li);
    });
}

// Инициализация
populateFilters();
displayMovies();

// Обработчики событий
searchBar.addEventListener('input', displayMovies);
genreFilter.addEventListener('change', displayMovies);
yearFilter.addEventListener('change', displayMovies);
ratingFilter.addEventListener('change', displayMovies);
