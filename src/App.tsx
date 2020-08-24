import React from "react";
import "./App.scss";
import movies from "./moveis.json";

function App() {
  return (
    <div className="App">
      <h1 className="title">Movie Search</h1>
      <input type="search" name="movie-search" className="search-input" />
      <div className="movies-container">
        {movies.map((movie) => {
          return (
            <div className="movie-item">
              <h2>
                {movie.title} ({movie.year})
              </h2>
              <img src="/logo512.png" alt={movie.title} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
