export interface Contents {
    id: number
    backdrop_path: string
    poster_path: string
    title: string
    overview: string
}

export interface GetTvsResult {
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

export enum ContentType {
    Movies = '현재 상영중인 영화',
    Tvs = '인기 TV 콘텐츠'
}