const watchlistUl = document.getElementById('watchlistMovies');

function getWatchList() {
  const watchList = localStorage.getItem('watchList');
  return watchList ? JSON.parse(watchList) : [];
}

function saveWatchList(watchListArray) {
  localStorage.setItem('watchList', JSON.stringify(watchListArray));
}

function removeFromWatchList(movieTitle) {
  let watchList = getWatchList();
  watchList = watchList.filter(title => title !== movieTitle);
  saveWatchList(watchList);
}

function displayWatchList() {
  watchlistUl.innerHTML = '';
  
  const watchListTitles = getWatchList();

  const watchListMovies = movies.filter(movie => watchListTitles.includes(movie.title));

  watchListMovies.forEach(movie => {
    const li = document.createElement('li');
    li.classList.add('movie-item');
    
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
      event.stopPropagation();
      removeFromWatchList(movie.title);
      displayWatchList();
    });
    
    actionsDiv.appendChild(removeBtn);

    li.appendChild(posterDiv);
    li.appendChild(titleDiv);
    li.appendChild(actionsDiv);

    watchlistUl.appendChild(li);
  });
}

displayWatchList();
