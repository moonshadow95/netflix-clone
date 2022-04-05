const TMDB_API_KEY = "adfada52c0254da043e46aa3051d1af5"
const YOUTUBE_API_KEY = "AIzaSyCFAbwMROkRy-Te_xDQxRkG6d-yIDxNszU"
const TMDB_BASE_PATH = "https://api.themoviedb.org/3"
const YOUTUBE_BASE_PATH = "https://www.googleapis.com/youtube/v3"

export async function getMovies() {
    const result = await (await fetch(`${TMDB_BASE_PATH}/movie/now_playing?api_key=${TMDB_API_KEY}`)).json()
    result['slider_title'] = 'Now Playing'
    return result
}

export async function getTvs() {
    const result = await (await fetch(`${TMDB_BASE_PATH}/trending/tv/day?api_key=${TMDB_API_KEY}`)).json()
    result['slider_title'] = 'TV Shows'
    return result
}

export async function searchMovieByKeyword(keyword: string) {
    return await (await fetch(`${TMDB_BASE_PATH}/search/movie?api_key=${TMDB_API_KEY}&query=${keyword}&page=1&include_adult=false`)).json()
}

export async function getVideo() {
    // const query = 'turning red trailer'
    // const result = await (await fetch(`${YOUTUBE_BASE_PATH}/search?part=snippet&maxResults=20&q=turning red trailer&type=video&key=${YOUTUBE_API_KEY}`)).json()
    // return result.items[0].id.videoId
    return 'XdKzUbAiswE'
}