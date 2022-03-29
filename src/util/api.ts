const TMDB_API_KEY = "adfada52c0254da043e46aa3051d1af5"
const YOUTUBE_API_KEY = "AIzaSyA_msx-1RyYLxUK0Xijqf9Yi5ZignK64Gg"
const TMDB_BASE_PATH = "https://api.themoviedb.org/3"
const YOUTUBE_BASE_PATH = "https://www.googleapis.com/youtube/v3"

export async function getMovies() {
    const result = await (await fetch(`${TMDB_BASE_PATH}/movie/now_playing?api_key=${TMDB_API_KEY}`)).json()
    const translations = await getTranslation(508947, "KR")
    // result.results.map((result: any) => {
    //         result.title = translations.title
    //         result.overview = translations.overview
    //     }
    // )
    result['slider_title'] = '현재 상영중인 영화'
    return result
}

export async function getTvs() {
    const result = await (await fetch(`${TMDB_BASE_PATH}/trending/tv/day?api_key=${TMDB_API_KEY}`)).json()
    const translations = await getTranslation(508947, "KR")
    //
    // result.results.map((result: any) => {
    //         result.title = translations.title
    //         result.overview = translations.overview
    //     }
    // )
    result['slider_title'] = '인기 TV 콘텐츠'
    return result
}

// TODO - Fix Translations
export async function getTranslation(id: number, iso: string) {
    const result = await (await fetch(`${TMDB_BASE_PATH}/movie/${id}/translations?api_key=${TMDB_API_KEY}`)).json()
    const translations = result.translations.find((item: any) => item.iso_3166_1 === iso).data
    return {title: translations.title, overview: translations.overview}
}

export async function searchMovieByKeyword(keyword: string) {
    return await (await fetch(`${TMDB_BASE_PATH}/search/movie?api_key=${TMDB_API_KEY}&query=${keyword}&page=1&include_adult=false`)).json()
}

export async function getVideo() {
    const query = 'turning red trailer'
    const result = await (await fetch(`${YOUTUBE_BASE_PATH}/«?part=snippet&maxResults=20&q=turning red trailer&type=video&key=${YOUTUBE_API_KEY}`)).json()
    return result.items[0].id.videoId
}