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
  background: linear-gradient(90deg, #a5ba07 0%, #e7f4b8 50%, #f4d87c 100%);
  box-shadow: 0 4px 12px rgba(150, 170, 90, 0.08);
}
.nav-drawer-custom {
  font-family:
    'Comic Sans MS',
    Comic Sans,
    cursive;
  background: linear-gradient(180deg, #dce4a1 0%, #fbfde8 50%, #f7fbda 100%);
  box-shadow: 2px 8px 20px rgba(120, 140, 80, 0.08);
  /* add a slight separation from the top app-bar and left edge */
  margin-top: 12px;
  margin-left: 12px;
  border-radius: 12px;
  overflow: hidden;
}
.bar-title {
  font-family: 'Comic Sans MS', cursive;
  font-size: 2.2rem;
  color: #5a4738;
  display: flex;
  align-items: center;
  font-weight: bold;
}
.bar-icon {
  color: #f39c12;
  filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.06));
}
.bar-text {
  margin-left: 16px;
  letter-spacing: 1px;
}
.menu-list {
  padding: 20px 12px;
}
.menu-item {
  margin: 12px 0;
  min-height: 60px;
  background: rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 18px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.menu-item:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 16px rgba(255, 154, 118, 0.3);
}
.menu-item.router-link-exact-active,
.menu-item.router-link-active {
  background: linear-gradient(135deg, #e8c89f 0%, #dfc689 50%, #e5d9a8 100%) !important;
  border-color: rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 4px 12px rgba(210, 180, 140, 0.3);
  transform: translateY(-2px);
}
.menu-item.router-link-exact-active .menu-avatar,
.menu-item.router-link-active .menu-avatar {
  background: rgba(255, 255, 255, 0.8) !important;
}
.menu-item.router-link-exact-active .menu-avatar .v-icon,
.menu-item.router-link-active .menu-avatar .v-icon {
  color: #fff !important;
}
.menu-item.router-link-exact-active .menu-title,
.menu-item.router-link-active .menu-title {
  color: #fff !important;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  font-weight: bold;
}
.menu-avatar {
  background: linear-gradient(135deg, #b0e693 0%, #82ccee 100%) !important;
  margin-right: 4px;
}
.menu-avatar .v-icon {
  color: #fff !important;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.15);
}
.menu-title {
  font-size: 1.4rem;
  font-family: 'Comic Sans MS', cursive;
  font-weight: bold;
  color: #a67c52;
  display: flex;
  align-items: center;
  height: 56px;
}
</style>
