import React, { useEffect, useState, useCallback } from "react";
import "./App.scss";
import stubMovies from "./moveis.json";

const corsProxy = "https://cors-anywhere.herokuapp.com/";

function App() {
  const [movies, setMovies] = useState([] as Movie[]);
  const [searchString, setSearchString] = useState("");

  const handleSearchString = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value);
  };

  const getMovieDataByTitle = async (title: string) => {
    const response = await fetch(
      corsProxy +
        `https://v2.sg.media-imdb.com/suggestion/${title[0].toLocaleLowerCase()}/${title}.json`
    ).then((res) => res.json());

    const movieObject = response.d[0];
    return {
      title: movieObject.l,
      imageUrl: movieObject.i.imageUrl,
      year: movieObject.y,
    } as Movie;
  };

  const getTopRatedMovies = useCallback(async () => {
    const IMDBTop250MoviesHTML = await fetch(
      corsProxy + "https://www.imdb.com/chart/top/?ref_=nv_mv_250"
    ).then((body) => body.text());
    const tempElement = document.createElement("div");
    tempElement.innerHTML = IMDBTop250MoviesHTML;
    const topMoviesTitles = [];

    // up to 250 movies
    for (let index = 1; index <= 250; index++) {
      const { stringValue: title } = document.evaluate(
        `//tbody/tr[${index}]/td[2]/a`,
        tempElement,
        null,
        2
      );

      topMoviesTitles.push(title);
    }

    const moviePromises = topMoviesTitles.map((title) => {
      return getMovieDataByTitle(title);
    });

    const topMovies = await Promise.allSettled(moviePromises);
    return topMovies;
  }, []);

  useEffect(
    () => {
      // (async () => {
      //   const moviesResult = await getTopRatedMovies();
      //   const fullfilledMovies = moviesResult.filter(
      //     (movie) => movie.status === "fulfilled"
      //   ) as PromiseFulfilledResult<Movie>[];

      //   const movies = fullfilledMovies.map((movie) => movie.value);
      //   console.log(movies);
      // setMovies(stubMovies);
      // })();
      setMovies(stubMovies);
    },
    [
      // getTopRatedMovies
    ]
  );

  useEffect(() => {
    if (searchString) {
      const newMovieList = stubMovies.filter((movie) =>
        movie.title
          .toLocaleLowerCase()
          .includes(searchString.toLocaleLowerCase())
      );
      setMovies(newMovieList);
    } else {
      setMovies(stubMovies);
    }
  }, [searchString]);

  return (
    <div className="App">
      <h1 className="title">Movie Search</h1>
      <input
        type="search"
        name="movie-search"
        className="search-input"
        placeholder="search for a movie..."
        value={searchString}
        onChange={handleSearchString}
      />
      <div className="movies-container">
        {movies.map((movie) => {
          return (
            <div key={movie.title} className="movie-item">
              <h2>
                {movie.title} ({movie.year})
              </h2>
              <img src={movie.imageUrl} alt={movie.title} width="250px" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
