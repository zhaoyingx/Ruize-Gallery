import type { GalleryResponse, GalleryQueryParams } from '@/types/gallery'

const API_BASE_URL = 'http://localhost:8082/api/v1'

export async function getGallery(params: GalleryQueryParams): Promise<GalleryResponse> {
  const queryParams: Record<string, string> = {
    year: params.year.toString(),
  }

  if (params.page !== undefined) {
    queryParams.page = params.page.toString()
  }

  if (params.pageSize !== undefined) {
    queryParams.pageSize = params.pageSize.toString()
  }

  const queryString = new URLSearchParams(queryParams).toString()

  const response = await fetch(`${API_BASE_URL}/gallery?${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export function getConvertedImageUrl(key: string): string {
  const encodedKey = encodeURIComponent(key)
  return `${API_BASE_URL}/image/convert?key=${encodedKey}`
}
