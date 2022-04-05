export interface Contents {
    id: number
    backdrop_path: string
    poster_path: string
    title?: string
    name?: string
    overview: string
}

export interface APIResult {
    page: number
    results: Contents[]
    total_pages: number
    total_results: number
    slider_title: string
}

export enum ContentType {
    Movies = 'Now Playing',
    Tvs = 'TV Shows'
}