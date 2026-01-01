import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getGallery } from '@/api/gallery'
import type { GalleryItem } from '@/types/gallery'

export const useGalleryStore = defineStore('gallery', () => {
  const items = ref<GalleryItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function loadGallery(year: number) {
    loading.value = true
    error.value = null

    try {
      const response = await getGallery({ year })
      items.value = response.data
      return response
    } catch (e) {
      error.value = e instanceof Error ? e.message : '加载失败'
      items.value = []
      throw e
    } finally {
      loading.value = false
    }
  }

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
