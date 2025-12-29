import type { GalleryResponse, GalleryQueryParams } from '@/types/gallery'

const API_BASE_URL = 'http://localhost:8082/api/v1'

/**
 * 获取画廊数据
 * @param params - 查询参数，包含year
 * @returns Promise<GalleryResponse>
 */
export async function getGallery(params: GalleryQueryParams): Promise<GalleryResponse> {
  const queryString = new URLSearchParams({
    year: params.year.toString(),
  }).toString()

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

/**
 * 获取转换后的图片URL
 * @param key - S3文件key
 * @returns 转换后的图片URL
 */
export function getConvertedImageUrl(key: string): string {
  const encodedKey = encodeURIComponent(key)
  return `${API_BASE_URL}/image/convert?key=${encodedKey}`
}
