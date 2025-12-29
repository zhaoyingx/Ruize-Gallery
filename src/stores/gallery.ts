import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getGallery } from '@/api/gallery'
import type { GalleryItem } from '@/types/gallery'

export const useGalleryStore = defineStore('gallery', () => {
  const items = ref<GalleryItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 加载指定年份的画廊数据
   */
  async function loadGallery(year: number) {
    loading.value = true
    error.value = null

    try {
      const response = await getGallery({ year })
      items.value = response.data
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载失败'
      throw e
    } finally {
      loading.value = false
    }
  }

  /**
   * 清空数据
   */
  function clear() {
    items.value = []
    error.value = null
  }

  return {
    items,
    loading,
    error,
    loadGallery,
    clear,
  }
})
