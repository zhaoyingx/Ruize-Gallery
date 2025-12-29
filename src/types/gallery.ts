export interface GalleryItem {
  key: string
  url: string
}

export interface GalleryResponse {
  data: GalleryItem[]
}

export interface GalleryQueryParams {
  year: number
}
