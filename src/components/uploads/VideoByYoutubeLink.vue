<template>
  <div>
    <h1 class="text-2xl">Envoyer une vidéo par lien YouTube</h1>
    <div class="flex flex-col gap-y-4 mt-6">
      <Input
        v-model="link"
        placeholder="Lien YouTube"
        class="w-full"
        @input="updatePreview"
      />
      <Input v-model="caption" placeholder="Légende" class="w-full" />
      <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div class="flex items-center gap-2">
          <input
            v-model.number="startTime"
            placeholder="Début"
            class="input w-24"
            type="number"
            min="0"
          />
          <span class="text-sm text-gray-500">sec</span>
        </div>
        <div class="flex items-center gap-2">
          <input
            v-model.number="endTime"
            placeholder="Fin"
            class="input w-24"
            type="number"
            min="0"
          />
          <span class="text-sm text-gray-500">sec</span>
        </div>
        <span v-if="startTime || endTime" class="text-sm text-gray-500">
          ({{ getTrimmedDuration() }}s sélectionnés)
        </span>
      </div>
      <div class="space-x-4">
        <input
          v-model="duration"
          placeholder="Durée"
          class="input w-32"
          type="number"
        />
        <span>secondes (0 correspond à la durée initiale de la vidéo)</span>
      </div>
      <Button :disabled="!link" @click="upload">Envoyer</Button>
    </div>
    <div class="flex flex-col mt-8 justify-center items-center">
      <h2 class="text-xl">Aperçu de la vidéo</h2>
      <span>Si l'aperçu ne charge pas correctement, la vidéo ne s'affichera sûrement pas sur les clients (sauf .mov)</span>
      <iframe
        id="ytplayer"
        :src="embedSrc"
        class="mt-4"
        width="640"
        height="360"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { useToast } from "vue-toast-notification";
import axios from "axios";
import Input from "../ui/Input.vue";
import Button from "../ui/Button.vue";

const server: string = import.meta.env.VITE_SERVER_URL as string;

const toast = useToast();

const link = ref<string>("");
const caption = ref<string>("");
const startTime = ref<number>(0);
const endTime = ref<number | null>(null);
const duration = ref<number>(5);

// Extract video ID from YouTube URL
const extractVideoId = (url: string): string | null => {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/]+)/
  );
  return match ? match[1] : null;
};

// Computed property for embed URL with start/end parameters
const embedSrc = computed(() => {
  const videoId = extractVideoId(link.value);
  if (!videoId) return "";

  let embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const params: string[] = [];

  if (startTime.value > 0) {
    params.push(`start=${startTime.value}`);
  }
  if (endTime.value && endTime.value > 0) {
    params.push(`end=${endTime.value}`);
  }

  if (params.length > 0) {
    embedUrl += `?${params.join("&")}`;
  }

  return embedUrl;
});

// Calculate trimmed duration for display
const getTrimmedDuration = (): number => {
  if (startTime.value === 0 && (!endTime.value || endTime.value === 0)) {
    return 0;
  }
  if (endTime.value && endTime.value > 0) {
    return endTime.value - startTime.value;
  }
  return 0;
};

// Update preview when inputs change
const updatePreview = () => {
  // The embedSrc computed property will automatically update
};

// Upload the video to the server
const upload = async () => {
  if (!link.value) return;

  // Build payload with optional trim values
  const data: Record<string, unknown> = {
    src: link.value,
    caption: caption.value,
    duration: duration.value * 1000,
  };

  // Only include startTime if it's greater than 0
  if (startTime.value > 0) {
    data.startTime = startTime.value;
  }

  // Only include endTime if it's set and greater than 0
  if (endTime.value && endTime.value > 0) {
    data.endTime = endTime.value;
  }

  try {
    await axios.post(`${server}/api/upload/video-by-link/youtube`, data);
    toast.success("Vidéo envoyée avec succès !", {
      position: "top",
      duration: 3000,
    });
  } catch (err) {
    toast.error("Erreur lors de l'envoi de la vidéo", {
      position: "top",
      duration: 3000,
    });
    console.error(err);
  }
};
</script>

<style></style>
