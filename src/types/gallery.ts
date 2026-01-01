export interface GalleryItem {
  key: string
  url: string
}

export interface GalleryResponse {
  data: GalleryItem[]
  hasMore?: boolean
  total?: number
}

export interface GalleryQueryParams {
  year: number
  page?: number
  pageSize?: number
}
