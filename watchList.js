//turn string to array. and remove duplicate values
const savedMovieSimdbId = localStorage.getItem("watchlist");
console.log(savedMovieSimdbId);
//store all the watchlist movies imdbID
let savedMovies = [];
const movieCardsContainer = document.getElementById("movieCardContainer")
let movieCardsHtml = '';

//if is not null
if (savedMovieSimdbId !== null) {
    //if only has one movie
    if (savedMovieSimdbId.includes(',')) {
        savedMovies = remove_duplicates_es6(localStorage.getItem("watchlist").split(','));
    }
    //if has more than one movie
    else {
        savedMovies.push(savedMovieSimdbId);
    }

    savedMovies.forEach(async (itemID, i) => {
        const newRes = await fetch(`https://www.omdbapi.com/?apikey=62678496&plot=full&i=${itemID}`);
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
                            ${item.Runtime} ${item.Genre} ${item.Type} <button id="${item.imdbID}" class="add-btn"> -Remove from watchlist</button>
                        </p>
                    </div>
                </div>
            `
        //update the page by overriding the .innerHTML
        movieCardsContainer.innerHTML = movieCardsHtml;
    })
    //eventListener: delete the certain movies
    document.getElementById("movieCardContainer").addEventListener('click', function (e) {
        if (e.target.matches(".add-btn")) {
            //if this is the button that is clicked
            console.log("button clicked");
            //delete the certain element
            if (savedMovies.indexOf(e.target.id) > -1) {
                savedMovies.splice(savedMovies.indexOf(e.target.id), 1);
            }
            //update the localstorage
            localStorage.setItem('watchlist', savedMovies)
        }
    });
}

// function: remove duplicate values; 
// code from: https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
function remove_duplicates_es6(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
}