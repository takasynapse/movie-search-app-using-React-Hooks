import './App.css';
import React, { useReducer, useEffect } from "react";
import Header from "./Header";
import Movie from "./Movie";
import Search from "./Search";

const MOVIE_API_URL = "http://www.omdbapi.com/?i=tt3896198&apikey=17e27b9e";

const initialState = {
  loading: true,
  movies: [],
  errorMessage: null
};


const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error
      };
    default:
      return state;
  }
};

function App() {
  // 3つのuseStateを使っている。
  const [state, dispatch] = useReducer(reducer, initialState);

  // useEffectは最初のレンダーの後に呼ばれる。
  // useEffectに渡された関数は、実行タイミングがレンダーのあと。
  // 第二引数に依存する変数の配列を記述する
  useEffect(() => {
    
    fetch(MOVIE_API_URL)
        .then(response => response.json())
        .then(jsonResponse => {
    
        dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.Search
      });
    });
}, []);


const search = searchValue => {
  dispatch({
    type: "SEARCH_MOVIES_REQUEST"
  });

    fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=4a3b711b`)
    .then(response => response.json())
    .then(jsonResponse => {
      if (jsonResponse.Response === "True") {
        dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.Search
        });
      } else {
        dispatch({
            type: "SEARCH_MOVIES_FAILURE",
            error: jsonResponse.Error
        });
      }
    });
};

const { movies, errorMessage, loading } = state;

  return (
    <div className="App">
    <Header text="HOOKED" />
    <Search searching={search} />
    <p className="App-intro">Sharing a few of our favourite movies</p>
    <div className="movies">
      {loading && !errorMessage ? (
        <span>loading... </span>
      ) : errorMessage ? (
        <div className="errorMessage">{errorMessage}</div>
      ) : (
        movies?.map((movie, index) => (
          <Movie key={`${index}-${movie.Title}`} movie={movie} />
        ))
      )}
    </div>
  </div>
  );
}

export default App;
