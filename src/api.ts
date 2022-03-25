const API_KEY = "adfada52c0254da043e46aa3051d1af5"
const BASE_PATH = "https://api.themoviedb.org/3"

export interface Contents {
    id: number
    backdrop_path: string
    poster_path: string
    title: string
    overview: string
}

export interface GetTrendingResult {
    results: Contents[]
}

export interface GetMoviesResult {
    dates: {
        maximum: string
        minimum: string
    }
    page: number
    results: Contents[]
    total_pages: number
    total_results: number
}

export async function getMovies() {
    const result = await (await fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`)).json()
    const translations = await getTranslation(508947, "KR")
    result['slider_title'] = '현재 상영중인 영화'

    // result.results.map((result: any) => {
    //         result.title = translations.title
    //         result.overview = translations.overview
    //     }
    // )
    return result
}

export async function getTrending() {
    const result = await (await fetch(`${BASE_PATH}/trending/tv/day?api_key=${API_KEY}`)).json()
    const translations = await getTranslation(508947, "KR")
    result['slider_title'] = '인기 TV 콘텐츠'
    //
    // result.results.map((result: any) => {
    //         result.title = translations.title
    //         result.overview = translations.overview
    //     }
    // )
    return result
}

// TODO - Fix Translations
export async function getTranslation(id: number, iso: string) {
    const result = await (await fetch(`${BASE_PATH}/movie/${id}/translations?api_key=${API_KEY}`)).json()
    const translations = result.translations.find((item: any) => item.iso_3166_1 === iso).data
    return {title: translations.title, overview: translations.overview}
}

export async function searchMovieByKeyword(keyword: string) {
    return await (await fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${keyword}&page=1&include_adult=false`)).json()
}