const API_KEY = "adfada52c0254da043e46aa3051d1af5"
const BASE_PATH = "https://api.themoviedb.org/3"

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        response => response.json()
    )
}