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

      <!-- Trim controls -->
      <div class="bg-gray-100 p-4 rounded-lg">
        <h3 class="font-semibold mb-2">Rogner la vidéo</h3>
        <div class="flex gap-4 items-center flex-wrap">
          <div>
            <label class="text-sm text-gray-600">Début (sec)</label>
            <input
              v-model.number="trimStart"
              type="number"
              min="0"
              class="input w-24"
              @input="updatePreview"
            />
          </div>
          <div>
            <label class="text-sm text-gray-600">Fin (sec)</label>
            <input
              v-model.number="trimEnd"
              type="number"
              min="0"
              class="input w-24"
              @input="updatePreview"
            />
          </div>
          <div class="text-sm text-gray-600">
            Durée selectionnée: {{ trimDuration }}s
          </div>
        </div>
      </div>

      <Button :disabled="!link || isUploading" @click="upload">
        {{ isUploading ? "Upload..." : "Envoyer" }}
      </Button>
    </div>

    <!-- Preview with trim markers -->
    <div class="flex flex-col mt-8 justify-center items-center">
      <h2 class="text-xl">Aperçu</h2>
      <p class="text-sm text-gray-600 mb-2">
        L'aperçu montre la zone qui sera rognée
      </p>
      <iframe
        id="ytplayer"
        :src="previewUrl"
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
import { ref, computed } from "vue";
import { useToast } from "vue-toast-notification";
import axios from "axios";
import Input from "../ui/Input.vue";
import Button from "../ui/Button.vue";

const server: string = import.meta.env.VITE_SERVER_URL as string;

const toast = useToast();

const link = ref<string>("");
const caption = ref<string>("");
const trimStart = ref<number>(0);
const trimEnd = ref<number>(0);
const isUploading = ref(false);

const videoId = computed(() => {
  if (!link.value) return "";
  const match = link.value.match(/(?:v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : "";
});

const previewUrl = computed(() => {
  if (!videoId.value) return "";
  let url = `https://www.youtube.com/embed/${videoId.value}`;
  const params = new URLSearchParams();
  if (trimStart.value > 0) params.set("start", trimStart.value.toString());
  if (trimEnd.value > 0) params.set("end", trimEnd.value.toString());
  const query = params.toString();
  if (query) url += `?${query}`;
  return url;
});

const trimDuration = computed(() => {
  if (trimEnd.value > 0 && trimEnd.value > trimStart.value) {
    return trimEnd.value - trimStart.value;
  }
  return 0;
});

const updatePreview = () => {
  // Force iframe refresh
  const player = document.getElementById("ytplayer") as HTMLIFrameElement;
  if (player) {
    player.src = previewUrl.value;
  }
};

const upload = async () => {
  if (!link.value || !videoId.value) return;

  isUploading.value = true;
  const data: any = {
    src: link.value,
    caption: caption.value,
    trimStart: trimStart.value,
  };

  if (trimEnd.value > 0) {
    data.trimEnd = trimEnd.value;
  }

  try {
    await axios.post(`${server}/api/upload/video-by-link/youtube`, data);
    toast.success("Vidéo YouTube envoyée avec succès !", {
      position: "top",
      duration: 3000,
    });
    // Reset form
    link.value = "";
    caption.value = "";
    trimStart.value = 0;
    trimEnd.value = 0;
    updatePreview();
  } catch (err) {
    toast.error("Erreur lors de l'envoi de la vidéo", {
      position: "top",
      duration: 3000,
    });
    console.error(err);
  } finally {
    isUploading.value = false;
  }
};
</script>
