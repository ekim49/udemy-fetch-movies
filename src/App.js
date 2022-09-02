import React, { useState, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loading Indicator
  const [error, setError] = useState(null); // Error Handling

  // GET 요청
  // useCallback 사용
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true); // change the state when it is starting to load
    setError(null); // 이전에 받은 에러를 초기화
    try {
      const response = await fetch('https://react-http-c23cc-default-rtdb.firebaseio.com/movies.json');
      // fetch API는 에러상태코드를 실제 에러로 취급하지 않아서 실제 오류로 처리하지 않는다. 그래서 자체적인 오류를 만들어서 표시한다.
      // 이런 에러 핸들링은 response.json() 으로 파싱하기 전에 처리한다.
      if (!response.ok) {
        throw new Error('Something went wrong!'); // 이 에러가 발생하면 아래 코드는 실행되지 않는다.
      }

      const data = await response.json();

      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);
      setIsLoading(false); // not loading anymore
    } catch (error) {
      setError(error.message);
      setIsLoading(false); // 에러가 발생하면 로딩이 필요 없다.
    }
    // setIsLoading(false) 위의 setIsLoding(false) 두 개 없애고 여기에 한번에 적어도 된다. 
  }, []); // useCallback 을 사용할때도 의존성 배열을 사용해서, 이 함수에 있는 모든 의존성을 나열해야 한다.

  // function 키워드로 fetchMoviesHandler 를 선언했다면 호이스팅이 되어서 useEffect 구문 아래에 fetchMoviesHandler 함수가 있었어도 됐는데, const 로 선언했기 때문에 이 상수가 전체 코드를 파싱하기 전에 useEffect 내에서 fetchMoviesHandler 함수를 호출하기 때문에 문제가 발생함. -> 그래서 const로 선언해 준 다음에 useEffect 를 위치시킨다.
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  // function fetchMoviesHandler() {
  //   fetch('https://swapi.dev/api/films/')
  //     .then(response => {
  //       return response.json();
  //     }).then(data => {
  //       const transformedMovies = data.results.map(movieData => {
  //         return {
  //           id: movieData.episode_id,
  //           title: movieData.title,
  //           openingText: movieData.opening_crawl,
  //           releaseDate: movieData.release_date
  //         };
  //       })
  //       setMovies(transformedMovies);
  //     });
  // }

  // POST 요청
  async function addMovieHandler(movie) {
    const response = await fetch('https://react-http-c23cc-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie), // Javascript obj / array => JSON 으로 변환 
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />
  }

  if (error) {
    content = <p>{error}</p>
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {/* {!isLoading && movies.length > 0 && <MoviesList movies={movies} />}
        {!isLoading && movies.length === 0 && !error && <p>Found no movies.</p>}
        {!isLoading && error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>} */}
        {content}
      </section>
    </>
  );
}

export default App;
