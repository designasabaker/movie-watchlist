const movieCardsContainer = document.getElementById("movieCardContainer");
let movies = [];            //store all the search results
let savedMovies = [];       //store all the watchlist movies imdbID
//empty eveything in localstorage, as soon as loading the main home page
localStorage.removeItem('watchlist');

//renderResults();click the search btn then do the fetch and all the work
document.getElementById("searchBtn").addEventListener("click", renderResults);

async function renderResults() {
    console.log("search button clicked");
    const searchInput = document.getElementById("searchBox").value;
    //refresh the container
    movieCardsContainer.innerHTML = `<div class="loader"></div>`;
    //refresh the movies
    movies = [];
    //fetch the info and push to the movies
    await searchMovies(searchInput);
    //all results printed, all +watchlist appeared
}

//function:
//the user click the search button, after that the function will be called
async function searchMovies(search) {
    //empty the previous search results in localstorage
    localStorage.removeItem('watchlist');
    //using the api to fetch the data
    const res = await fetch(`https://www.omdbapi.com/?apikey=62678496&plot=full&s=${search}`);
    const data = await res.json();
    //data.Search is an array of movies, but still need more info, then fetch again
    //each movie need to be fetched again, in a for loop
    let movieCardsHtml = '';

    //true: the research return something
    //false: no results, show the message for user to adjust the search words
    if (data.Search) {
        for (let i = 0; i < data.Search.length; i++) {
            const newRes = await fetch(`https://www.omdbapi.com/?apikey=62678496&plot=full&i=${data.Search[i].imdbID}`);
            const item = await newRes.json();
            //use the json info to generate the HTML code
            movieCardsHtml += `
                <div class="movie-card" id="movieCard${i}">
                    <div class="poster">
                        <img src="${item.Poster}" alt="movie ${item.Title} image">
                    </div>
                    <div class="movie-info">
                        <h3>${item.Title}</h3>
                        <p>
                            ${item.Runtime} ${item.Genre} ${item.Type} <button id="${item.imdbID}" class="add-btn"> +Watchlist</button>
                        </p>
                    </div>
                </div>
            `
            //update the page by overriding the .innerHTML
            movieCardsContainer.innerHTML = movieCardsHtml;
        }//end for loop
        //cannot addEventlisterner in the for loop
    } else {
        movieCardsHtml = `<p class="searchNullMsg">:( No results, please search again</p>`;
        //update the page by overriding the .innerHTML
        movieCardsContainer.innerHTML = movieCardsHtml;
    }

    //eventListener: 
    document.getElementById("movieCardContainer").addEventListener('click', function (e) {
        if (e.target.matches(".add-btn")) {
            //if this is the button that is clicked
            console.log("button clicked");
            const imdbID = e.target.id;
            savedMovies.push(imdbID);
            localStorage.setItem('watchlist', savedMovies)
        }
    });
}