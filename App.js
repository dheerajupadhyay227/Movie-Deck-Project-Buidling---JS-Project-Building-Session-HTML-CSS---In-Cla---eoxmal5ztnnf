let pageNumber;
let totalPage = 0;
let sortBtnByReleaseDate = document.querySelector('#sort-date');
let sortBtnByPopularity = document.querySelector('#sort-rate');
let movieList = document.querySelector('#movie-list');
let nextPageBtn = document.querySelector('#next-page');
let prevPageBtn = document.querySelector('#prev-page');
let currPageBtn = document.querySelector('#curr-page');
let showFavoriteMovies = document.querySelector('#show-fav');
let shwoAllMovies = document.querySelector('#show-all');
let favoriteMoviesArray = [];
let favoriteMoviesIdArray = [];
let sortByProperty = "vote_count.desc";

async function getData(pageNumber, sort){

    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZGNiMTY3YWY0YjM4MjZlNmIyMzRjOGZmZGI2YTg3ZCIsInN1YiI6IjY0ZDM4NWFmZGI0ZWQ2MDBlMmI0ZjhjMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jgY8TgBak84vKO3UJK0mmxDiVWo8W5EHNDoOGqOJQ6o'
        }
    };
      
    let response = await fetch(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${pageNumber}&sort_by=${sort}`, options)
    let dataObj = await response.json();
    movieList.innerHTML = "";
    totalPage = dataObj.total_pages;
    
    dataObj.results.forEach((element)=>{
        movieList.innerHTML += `<section class="movies-card" id="${element.id}">
        <section class="poster">
            <img src="https://image.tmdb.org/t/p/w300${element.backdrop_path}" alt="Oops something broke..." class="movie-poster"/>
        </section>
        <h2 class="movie-title">${element.title}</h2>
        <footer class="movie-card--footer">
            <section class="movie-rating">
                <p class="movie--vote-count">Vote count: ${element.vote_count}</p>
                <p class="movie--vote-avg">Average vote: ${element.vote_average}</p>
            </section>
            <section class="fav-movie">
                <i class="fa-regular fa-heart fav-movie-icon"></i>
            </section>
        </footer>
    </section>`;
    })
    
    addHeartToFavMovie();
    // Updated current page Number
    currPageBtn.innerText = `Current Page: ${pageNumber}`
}
// Displayed sorted movies by release date
function displaySortByReleaseDate(){
    sortBtnByReleaseDate.addEventListener('click', ()=> {

        if(sortByProperty !== "primary_release_date.desc"){
            sortByProperty ="primary_release_date.desc";
            sortBtnByReleaseDate.innerHTML = `Sort by date <i class="fa-solid fa-arrow-down">`
        }
        else{
            sortByProperty= 'primary_release_date.asc';
            sortBtnByReleaseDate.innerHTML = `Sort by date <i class="fa-solid fa-arrow-up">`
        }
        sortBtnByPopularity.innerHTML = `Sort by rating`
        paginationShow()
        getData(1, sortByProperty);
    })
}
// Displayed sorted movies by popularity
function displaySortByPopularity(){
    sortBtnByPopularity.addEventListener('click', () => {

        if(sortByProperty === "vote_count.desc"){
            sortByProperty = "vote_count.asc"
            sortBtnByPopularity.innerHTML = `Sort by rating <i class="fa-solid fa-arrow-up">`
        }
        else{
            sortByProperty="vote_count.desc";
            sortBtnByPopularity.innerHTML = `Sort by rating <i class="fa-solid fa-arrow-down">`
        }
        sortBtnByReleaseDate.innerHTML = `Sort by date`
        paginationShow();
        getData(1,sortByProperty);
    })
}
// Showed All Movies when clicked on All button
function displayAllMovies(){
    shwoAllMovies.addEventListener('click',()=>{
        if(!shwoAllMovies.classList.contains('active-tab')){
            showFavoriteMovies.classList.toggle('active-tab');
            shwoAllMovies.classList.toggle('active-tab');
        }
        sortBtnByPopularity.innerHTML = `Sort by rating`
        sortBtnByReleaseDate.innerHTML = `Sort by date`
        sortByProperty="vote_count.desc"
        pageNumber = 1;
        paginationShow();
        getData(pageNumber,sortByProperty);

    })
};
// Toggled the heart icon to solid or regular based on whether its already added as a favorite(When page load)
function addHeartToFavMovie(){

    movieList.childNodes.forEach((element)=>{
        let id = element.id;
        let index = favoriteMoviesIdArray.indexOf(id);
        if(index !== -1){
            let like = element.childNodes[5].lastChild.previousSibling.childNodes[1];
            like.classList.toggle("fa-solid");
        }
    })
};
// Added Favorite movies card and it's ids in an Array of Favorite movies
function favoriteMovieList(){

    movieList.addEventListener('click',(event)=>{
        if(event.target.classList.contains('fav-movie-icon')){
            let target = event.target;
            
            target.classList.add("fa-regular"); // getting bug when using target.classList.toggle("fa-regular");
            target.classList.toggle('fa-solid');
            let id = target.parentNode.parentNode.parentNode.id;
            if(/fa-solid/.test(target.className)){
                favoriteMoviesIdArray.unshift(id);
                favoriteMoviesArray.unshift(target.parentNode.parentNode.parentNode)
            }
            else{
                let index = favoriteMoviesIdArray.indexOf(id);
                favoriteMoviesIdArray.splice(index, 1)
                favoriteMoviesArray.splice(index,1 )
            }
        }
    });
};
// Displayed Favorite Movies when clicked on Favorite button
function displayFavoriteMovies(){

    showFavoriteMovies.addEventListener('click',()=>{
        paginationHide()
        sortBtnByPopularity.innerHTML = `Sort by rating`
        sortBtnByReleaseDate.innerHTML = `Sort by date`
        if(!showFavoriteMovies.classList.contains('active-tab')){
            showFavoriteMovies.classList.toggle('active-tab');
            shwoAllMovies.classList.toggle('active-tab');
        }
        if(favoriteMoviesArray.length == 0){
            movieList.innerHTML = "No movies added to your favorites yet";
            return;
        }
        movieList.innerHTML ="";
        favoriteMoviesArray.forEach((element)=>{
            movieList.appendChild(element);
        })
        
    })
};
// Loaded Next or Previous page
function addNavigationButtons(){

    // Loaded next page
    nextPageBtn.addEventListener('click',()=>{
        if(totalPage > pageNumber){
            pageNumber++;
            getData(pageNumber,sortByProperty)
        }
        
    });
    // Loaded previous page
    prevPageBtn.addEventListener('click',()=>{
        if (pageNumber > 1 ){
            pageNumber--;
            getData(pageNumber,sortByProperty)
        }

    })
};
function paginationHide(){
    nextPageBtn.style.visibility = 'hidden'
    prevPageBtn.style.visibility = 'hidden'
    currPageBtn.style.visibility = 'hidden'
}
function paginationShow(){
    nextPageBtn.style.visibility = 'visible'
    prevPageBtn.style.visibility = 'visible'
    currPageBtn.style.visibility = 'visible'
}

// Initialized the page
async function init(){
    pageNumber = 1;
    await getData(1,sortByProperty);
    displaySortByReleaseDate()
    displaySortByPopularity()
    addNavigationButtons();
    favoriteMovieList();
    displayFavoriteMovies();
    displayAllMovies();
};
init();
