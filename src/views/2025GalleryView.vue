<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h5">2025 年度作品</v-card-title>

      <v-card-text>
        <v-progress-circular v-if="galleryStore.loading" indeterminate />

        <v-alert v-else-if="galleryStore.error" type="error">
          {{ galleryStore.error }}
        </v-alert>

        <div v-else-if="galleryStore.items.length > 0">
          <v-row>
            <v-col v-for="item in galleryStore.items" :key="item.key" cols="12" sm="6" md="4">
              <v-card>
                <v-img :src="getConvertedImageUrl(item.key)" :alt="item.key" height="200" cover />
                <v-card-title>{{ getFileName(item.key) }}</v-card-title>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <div v-else>暂无作品</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGalleryStore } from '@/stores/gallery'
import { getConvertedImageUrl } from '@/api/gallery'

const galleryStore = useGalleryStore()

/**
 * 从文件路径中提取文件名
 */
function getFileName(key: string): string {
  const parts = key.split('/')
  return parts[parts.length - 1] || key
}

onMounted(async () => {
  try {
    await galleryStore.loadGallery(2025)
  } catch (error) {
    console.error('加载画廊数据失败:', error)
  }
})
</script>
