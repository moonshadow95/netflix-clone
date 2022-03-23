const API_KEY = "adfada52c0254da043e46aa3051d1af5"
const BASE_PATH = "https://api.themoviedb.org/3"

export interface Movies {
    id: number
    backdrop_path: string
    poster_path: string
    title: string
    overview: string
}

export interface GetMoviesResult {
    dates: {
        maximum: string
        minimum: string
    }
    page: number
    results: Movies[]
    total_pages: number
    total_results: number
}

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
        response => response.json()
    )
}