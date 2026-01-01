<template>
  <v-container fluid class="gallery-container">
    <div class="header-section mb-6">
      <h1 class="text-h4 font-weight-bold">{{ year }} Gallery</h1>
      <p class="text-subtitle-1 text-grey-darken-1 mt-2">
        {{
          galleryStore.items.length > 0
            ? `${galleryStore.items.length} artworks`
            : 'Explore amazing artworks'
        }}
      </p>
    </div>

    <div v-if="galleryStore.loading" class="text-center py-16">
      <v-progress-circular indeterminate size="64" color="primary" />
      <div class="mt-6 text-h6 text-grey">Loading...</div>
    </div>

    <v-alert
      v-else-if="galleryStore.error && galleryStore.items.length === 0"
      type="warning"
      variant="tonal"
      class="mx-auto"
      max-width="600"
    >
      <div class="text-h6">{{ galleryStore.error }}</div>
      <div class="text-body-2 mt-2">Content for {{ year }} coming soon</div>
    </v-alert>

    <div
      v-else-if="galleryStore.items.length > 0"
      class="waterfall-container"
      ref="scrollContainer"
    >
      <div class="waterfall-column">
        <div
          v-for="(item, index) in leftColumnItems"
          :key="item.key"
          class="gallery-item"
          @click="openLightbox(getLeftColumnIndex(index))"
        >
          <v-card elevation="2" class="gallery-card" hover>
            <v-img
              :src="getConvertedImageUrl(item.key)"
              :alt="getFileName(item.key)"
              :aspect-ratio="1"
              cover
              class="gallery-image"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="grey-lighten-2" />
                </div>
              </template>
            </v-img>
            <v-card-text class="pa-3">
              <div class="text-body-2 text-truncate">{{ getFileName(item.key) }}</div>
            </v-card-text>
          </v-card>
        </div>
      </div>

      <div class="waterfall-column">
        <div
          v-for="(item, index) in rightColumnItems"
          :key="item.key"
          class="gallery-item"
          @click="openLightbox(getRightColumnIndex(index))"
        >
          <v-card elevation="2" class="gallery-card" hover>
            <v-img
              :src="getConvertedImageUrl(item.key)"
              :alt="getFileName(item.key)"
              :aspect-ratio="1"
              cover
              class="gallery-image"
            >
              <template v-slot:placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="grey-lighten-2" />
                </div>
              </template>
            </v-img>
            <v-card-text class="pa-3">
              <div class="text-body-2 text-truncate">{{ getFileName(item.key) }}</div>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </div>

    <div v-else-if="!galleryStore.loading && galleryStore.items.length === 0" class="empty-state">
      <v-icon size="120" color="grey-lighten-2">mdi-image-off-outline</v-icon>
      <div class="text-h5 mt-6 font-weight-medium">Content Coming Soon</div>
      <div class="text-body-1 mt-2 text-grey">{{ year }} artworks will be available soon</div>
    </div>

    <ImageLightbox
      v-model:visible="lightboxVisible"
      v-model:current-index="currentImageIndex"
      :items="galleryStore.items"
    />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, watch, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useGalleryStore } from '@/stores/gallery'
import { getConvertedImageUrl } from '@/api/gallery'
import ImageLightbox from '@/components/ImageLightbox.vue'

const route = useRoute()
const galleryStore = useGalleryStore()
const scrollContainer = ref<HTMLElement | null>(null)
const lightboxVisible = ref(false)
const currentImageIndex = ref(0)

const year = computed(() => {
  const yearParam = route.params.year
  return typeof yearParam === 'string' ? parseInt(yearParam, 10) : 2025
})

const leftColumnItems = computed(() => {
  return galleryStore.items.filter((_, index) => index % 2 === 0)
})

const rightColumnItems = computed(() => {
  return galleryStore.items.filter((_, index) => index % 2 === 1)
})

function getFileName(key: string): string {
  const parts = key.split('/')
  return parts[parts.length - 1] || key
}

function getLeftColumnIndex(columnIndex: number): number {
  return columnIndex * 2
}

function getRightColumnIndex(columnIndex: number): number {
  return columnIndex * 2 + 1
}

function openLightbox(index: number) {
  currentImageIndex.value = index
  lightboxVisible.value = true
}

async function loadData() {
  try {
    await galleryStore.loadGallery(year.value)
  } catch (error) {
    console.error('Failed to load gallery data:', error)
  }
}

onMounted(() => {
  loadData()
})

watch(year, () => {
  loadData()
})
</script>

<style scoped>
.gallery-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 16px;
}

.header-section {
  text-align: center;
  margin-bottom: 32px;
}

.waterfall-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.waterfall-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.gallery-item {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.gallery-item:hover {
  transform: translateY(-4px);
}

.gallery-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 3px solid transparent;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(135deg, #f7971e 0%, #ffd200 100%) border-box;
}

.gallery-card:hover {
  box-shadow: 0 12px 32px rgba(247, 151, 30, 0.25) !important;
  transform: translateY(-2px);
  border: 3px solid transparent;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(135deg, #ffd200 0%, #f7971e 100%) border-box;
}

.gallery-image {
  border-radius: 13px 13px 0 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
}
</style>
