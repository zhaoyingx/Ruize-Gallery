<template>
  <v-app>
    <v-app-bar app height="80" class="app-bar-custom" flat>
      <v-app-bar-title class="bar-title">
        <v-icon size="44" class="bar-icon">mdi-palette</v-icon>
        <span class="bar-text">Ruize's Gallery</span>
      </v-app-bar-title>
    </v-app-bar>
    <v-navigation-drawer app v-model="drawer" width="200" class="nav-drawer-custom">
      <v-list nav class="menu-list">
        <v-list-item
          v-for="item in menuItems"
          :key="item.year"
          :to="item.to"
          router
          class="menu-item"
          rounded="xl"
        >
          <template #prepend>
            <v-avatar class="menu-avatar" size="20">
              <v-icon size="20">mdi-star-four-points</v-icon>
            </v-avatar>
          </template>
          <v-list-item-title class="menu-title">{{ item.year }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container class="fill-height">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const drawer = ref(true)
const years = [2025, 2026]
const menuItems = computed(() =>
  years.map((year) => ({
    year,
    to: `/gallery/${year}`,
  })),
)
</script>

<style scoped>
.app-bar-custom {
  font-family:
    'Comic Sans MS',
    Comic Sans,
    cursive;
  background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);
  box-shadow: 0 10px 40px rgba(247, 151, 30, 0.35);
  backdrop-filter: blur(10px);
  position: relative;
}

.app-bar-custom::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%);
  pointer-events: none;
}

.nav-drawer-custom {
  font-family:
    'Comic Sans MS',
    Comic Sans,
    cursive;
  background: linear-gradient(180deg, #fffef7 0%, #fff8e1 100%);
  box-shadow: 4px 0 30px rgba(247, 151, 30, 0.12);
  margin-top: 12px;
  margin-left: 12px;
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid rgba(247, 151, 30, 0.2);
}
.bar-title {
  font-family: 'Comic Sans MS', cursive;
  font-size: 2.2rem;
  color: #ffffff;
  display: flex;
  align-items: center;
  font-weight: bold;
  text-shadow: 0 4px 12px rgba(156, 39, 176, 0.3);
  position: relative;
  z-index: 1;
}
.bar-icon {
  color: #ffffff;
  filter: drop-shadow(0 4px 8px rgba(255, 255, 255, 0.5));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }
  50% {
    transform: translateY(-6px) scale(1.08);
  }
}

.bar-text {
  margin-left: 16px;
  letter-spacing: 2px;
}
.menu-list {
  padding: 24px 16px;
}
.menu-item {
  margin: 16px 0;
  min-height: 64px;
  background: linear-gradient(135deg, #ffffff 0%, #fffef7 100%);
  border: 2px solid rgba(247, 151, 30, 0.25);
  border-radius: 18px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 12px rgba(247, 151, 30, 0.1);
  position: relative;
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 210, 0, 0.15), transparent);
  transition: left 0.5s;
}

.menu-item:hover::before {
  left: 100%;
}

.menu-item:hover {
  transform: translateX(10px) scale(1.03);
  background: linear-gradient(135deg, #ffffff 0%, #fffef7 100%);
  box-shadow: 0 10px 30px rgba(247, 151, 30, 0.25);
  border-color: rgba(247, 151, 30, 0.5);
}
.menu-item.router-link-exact-active,
.menu-item.router-link-active {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%) !important;
  border-color: transparent !important;
  box-shadow: 0 10px 35px rgba(17, 153, 142, 0.4);
  transform: translateX(10px) scale(1.03);
}
.menu-item.router-link-exact-active .menu-avatar,
.menu-item.router-link-active .menu-avatar {
  background: rgba(255, 255, 255, 0.35) !important;
  box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.6);
}
.menu-item.router-link-exact-active .menu-avatar .v-icon,
.menu-item.router-link-active .menu-avatar .v-icon {
  color: #ff4757 !important;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
}
.menu-item.router-link-exact-active .menu-title,
.menu-item.router-link-active .menu-title {
  color: #ffffff !important;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-weight: bold;
}
.menu-avatar {
  background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%) !important;
  margin-right: 4px;
  box-shadow: 0 3px 12px rgba(247, 151, 30, 0.35);
}
.menu-avatar .v-icon {
  color: #ffffff !important;
}
.menu-title {
  font-size: 1.5rem;
  font-family: 'Comic Sans MS', cursive;
  font-weight: bold;
  color: #f7971e;
  display: flex;
  align-items: center;
  height: 56px;
  transition: all 0.3s ease;
}
</style>
