<template>
  <div class="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-16 lg:py-0">
    <div class="py-32">
      <Tabs :tabs="tabs" @current-tab="changeTab" class="mb-12"/>
      <ImageByFile v-if="activeTab === 0" />
      <ImageByLink v-if="activeTab === 1" />
      <VideoByFile v-if="activeTab === 2" />
      <VideoByLink v-if="activeTab === 3" />
      <!-- <VideoByYoutubeLink v-if="activeTab === 4" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Tabs from './components/ui/Tabs.vue';
import ImageByFile from './components/uploads/ImageByFile.vue';
import ImageByLink from './components/uploads/ImageByLink.vue';
import VideoByFile from './components/uploads/VideoByFile.vue';
import VideoByLink from './components/uploads/VideoByLink.vue';
// import VideoByYoutubeLink from './components/uploads/VideoByYoutubeLink.vue';

const tabs: string[] = ['Image par fichier', 'Image par lien', 'Vidéo par fichier', 'Vidéo par lien (mp4, mov, etc)']; //, 'Vidéo par lien YouTube' desactivé pour le moment
const activeTab = ref(0);

const changeTab = (index: number) => {
  activeTab.value = index;
};
</script>
