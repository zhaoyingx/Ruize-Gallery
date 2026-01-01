<template>
  <v-dialog
    :model-value="visible"
    @update:model-value="closeDialog"
    width="auto"
    max-width="98vw"
    class="lightbox-dialog"
  >
    <div v-if="currentImage" class="dialog-wrapper">
      <v-btn
        icon
        class="nav-btn-side nav-btn-left"
        @click="prevImage"
        :disabled="currentIndex === 0"
        size="x-large"
      >
        <v-icon color="#f7971e" size="40">mdi-chevron-left</v-icon>
      </v-btn>

      <v-card class="lightbox-card" elevation="24">
        <v-btn icon class="close-btn" @click="closeDialog(false)" size="large" color="white">
          <v-icon color="#f7971e" size="28">mdi-close</v-icon>
        </v-btn>

        <div class="lightbox-content">
          <div class="lightbox-image-section">
            <div
              class="image-wrapper"
              @mousemove="handleMouseMove"
              @mouseleave="showZoom = false"
              ref="imageContainer"
            >
              <v-img
                :src="getConvertedImageUrl(currentImage.key)"
                :alt="getFileName(currentImage.key)"
                max-height="75vh"
                class="lightbox-image"
                @load="imageLoaded = true"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate size="64" color="orange" />
                  </div>
                </template>
              </v-img>

              <div v-if="showZoom" class="zoom-lens" :style="zoomLensStyle"></div>

              <div v-if="showZoom" class="zoom-result" :style="zoomResultStyle"></div>
            </div>
          </div>

          <div class="lightbox-info-section">
            <div class="info-header">
              <v-icon size="32" color="orange">mdi-image</v-icon>
              <h2 class="text-h5 font-weight-bold ml-3">{{ getFileName(currentImage.key) }}</h2>
            </div>

            <v-divider class="my-6"></v-divider>

            <div class="info-description">
              <h3 class="text-h6 mb-3">Description</h3>
              <p class="text-body-1 text-grey">No description available</p>
            </div>
          </div>
        </div>
      </v-card>

      <v-btn
        icon
        class="nav-btn-side nav-btn-right"
        @click="nextImage"
        :disabled="currentIndex === items.length - 1"
        size="x-large"
      >
        <v-icon color="#f7971e" size="40">mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { getConvertedImageUrl } from '@/api/gallery'
import type { GalleryItem } from '@/types/gallery'

interface Props {
  visible: boolean
  items: GalleryItem[]
  currentIndex: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'update:currentIndex': [value: number]
}>()

const imageContainer = ref<HTMLElement | null>(null)
const showZoom = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const zoomLevel = 2.5
const imageLoaded = ref(false)
const zoomEnabled = ref(false)

const preloadedIndices = new Set<number>()

function preloadImages(startIndex: number, count: number) {
  for (let i = startIndex; i < Math.min(startIndex + count, props.items.length); i++) {
    if (preloadedIndices.has(i)) {
      continue
    }
    const item = props.items[i]
    if (item) {
      const img = new Image()
      img.src = getConvertedImageUrl(item.key)
      preloadedIndices.add(i)
    }
  }
}

const currentImage = computed(() => {
  return props.items[props.currentIndex] || null
})

const zoomLensStyle = computed(() => {
  const lensSize = 150
  return {
    left: `${mouseX.value - lensSize / 2}px`,
    top: `${mouseY.value - lensSize / 2}px`,
    width: `${lensSize}px`,
    height: `${lensSize}px`,
  }
})

const zoomResultStyle = computed(() => {
  if (!imageContainer.value || !currentImage.value || !imageLoaded.value) {
    return { display: 'none' }
  }

  const imgElements = imageContainer.value.querySelectorAll('img')
  let imgElement: HTMLImageElement | null = null

  console.log(
    'Checking images, currentIndex:',
    props.currentIndex,
    'total imgs:',
    imgElements.length,
    'imageLoaded:',
    imageLoaded.value,
  )

  for (const img of Array.from(imgElements)) {
    console.log('Image check:', {
      src: img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
    })
    if (img.complete && img.naturalWidth > 0) {
      imgElement = img as HTMLImageElement
      break
    }
  }

  if (!imgElement) {
    console.log('No ready image found for zoom')
    return { display: 'none' }
  }

  const imgRect = imgElement.getBoundingClientRect()
  const containerRect = imageContainer.value.getBoundingClientRect()

  const mouseXInContainer = mouseX.value + containerRect.left
  const mouseYInContainer = mouseY.value + containerRect.top

  const relativeX = mouseXInContainer - imgRect.left
  const relativeY = mouseYInContainer - imgRect.top

  const bgPosX = (relativeX / imgRect.width) * 100
  const bgPosY = (relativeY / imgRect.height) * 100

  const resultSize = 250
  const offset = 30
  let left = mouseX.value + offset
  let top = mouseY.value + offset

  if (left + resultSize > containerRect.width) {
    left = mouseX.value - resultSize - offset
  }
  if (top + resultSize > containerRect.height) {
    top = mouseY.value - resultSize - offset
  }

  console.log('Zoom style:', {
    src: imgElement.src,
    bgPosX,
    bgPosY,
    size: `${imgRect.width * zoomLevel}px ${imgRect.height * zoomLevel}px`,
  })

  return {
    backgroundImage: `url("${imgElement.src}")`,
    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
    backgroundSize: `${imgRect.width * zoomLevel}px ${imgRect.height * zoomLevel}px`,
    left: `${left}px`,
    top: `${top}px`,
    display: 'block',
  }
})

function handleMouseMove(event: MouseEvent) {
  if (!imageContainer.value) return

  const imgElement = imageContainer.value.querySelector('img')
  if (!imgElement) return

  const imgRect = imgElement.getBoundingClientRect()
  const containerRect = imageContainer.value.getBoundingClientRect()

  const relativeX = event.clientX - imgRect.left
  const relativeY = event.clientY - imgRect.top

  if (
    relativeX >= 0 &&
    relativeX <= imgRect.width &&
    relativeY >= 0 &&
    relativeY <= imgRect.height
  ) {
    if (!zoomEnabled.value) {
      zoomEnabled.value = true
      showZoom.value = true
    }
    mouseX.value = event.clientX - containerRect.left
    mouseY.value = event.clientY - containerRect.top
  } else {
    showZoom.value = false
  }
}

function getFileName(key: string): string {
  const parts = key.split('/')
  return parts[parts.length - 1] || key
}

function closeDialog(value: boolean) {
  emit('update:visible', value)
}

function prevImage() {
  if (props.currentIndex > 0) {
    imageLoaded.value = false
    zoomEnabled.value = false
    emit('update:currentIndex', props.currentIndex - 1)
  }
}

function nextImage() {
  if (props.currentIndex < props.items.length - 1) {
    imageLoaded.value = false
    zoomEnabled.value = false
    emit('update:currentIndex', props.currentIndex + 1)
  }
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      imageLoaded.value = false
      zoomEnabled.value = false
      preloadImages(5, 5)
    }
  },
)

watch(
  () => props.currentIndex,
  (newIndex) => {
    const nextBatchStart = Math.floor((newIndex + 5) / 5) * 5 + 5
    preloadImages(nextBatchStart, 5)
  },
)
</script>

<style scoped>
.dialog-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  position: relative;
  width: 90vw;
  max-width: 2200px;
  margin: 0 auto;
}

.nav-btn-side {
  background: rgba(255, 240, 200, 0.5) !important;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(247, 151, 30, 0.4);
  height: 85vh;
  border-radius: 12px;
  min-width: 70px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.nav-btn-side:hover:not(:disabled) {
  background: rgba(247, 151, 30, 0.9) !important;
  border-color: #f7971e;
  box-shadow: 0 8px 32px rgba(247, 151, 30, 0.4);
}

.nav-btn-side:hover:not(:disabled) .v-icon {
  color: white !important;
}

.nav-btn-side:disabled {
  background: rgba(255, 240, 200, 0.5) !important;
  border-color: rgba(247, 151, 30, 0.4) !important;
  cursor: not-allowed;
  pointer-events: auto;
}

.nav-btn-side:disabled .v-icon {
  color: #cccccc !important;
}

.lightbox-card {
  border-radius: 24px !important;
  overflow: hidden;
  background: linear-gradient(135deg, #ffffff 0%, #fffef7 100%);
  border: 3px solid transparent;
  background-clip: padding-box;
  position: relative;
  flex: 1;
  max-width: 2000px;
}

.lightbox-card::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
  border-radius: 24px;
  z-index: -1;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.close-btn:hover {
  background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%) !important;
}

.close-btn:hover .v-icon {
  color: white !important;
}

.lightbox-content {
  display: flex;
  height: 85vh;
}

.lightbox-image-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  padding: 40px;
  align-items: center;
  justify-content: center;
  min-width: 0;
  height: 85vh;
}

.image-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  cursor: crosshair;
}

.zoom-lens {
  position: absolute;
  border: 3px solid #f7971e;
  border-radius: 50%;
  pointer-events: none;
  background: rgba(247, 151, 30, 0.1);
  z-index: 10;
}

.zoom-result {
  position: absolute;
  width: 250px;
  height: 250px;
  border: 3px solid #f7971e;
  border-radius: 16px;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 100;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  background-color: white;
}

.lightbox-image {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-counter {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.lightbox-info-section {
  width: 350px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #fffef7 0%, #fff8e1 100%);
  border-left: 2px solid rgba(247, 151, 30, 0.2);
  padding: 40px 32px;
  overflow-y: auto;
}

.info-header {
  display: flex;
  align-items: center;
  color: #f7971e;
}

.info-description h3 {
  color: #f7971e;
  font-weight: 600;
}

.info-description p {
  line-height: 1.8;
}

@media (max-width: 960px) {
  .dialog-wrapper {
    flex-direction: column;
  }

  .nav-btn-side {
    height: auto;
    width: 100%;
    min-width: 100%;
    min-height: 48px;
  }

  .nav-btn-left {
    order: 2;
  }

  .lightbox-card {
    order: 1;
  }

  .nav-btn-right {
    order: 3;
  }

  .lightbox-content {
    flex-direction: column;
  }

  .lightbox-image-section {
    min-height: 60vh;
    padding: 24px;
  }

  .lightbox-info-section {
    width: 100%;
    border-left: none;
    border-top: 2px solid rgba(247, 151, 30, 0.2);
    padding: 24px;
  }
}

@media (max-width: 600px) {
  .lightbox-image-section {
    padding: 16px;
  }

  .lightbox-info-section {
    padding: 16px;
  }

  .info-header h2 {
    font-size: 1.1rem !important;
  }

  .nav-btn-side {
    min-height: 40px;
  }

  .nav-btn-side .v-icon {
    font-size: 28px !important;
  }
}
</style>
