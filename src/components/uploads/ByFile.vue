<template>
  <div>
    <div class="space-y-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">Envoi de média</h1>
        <p>Envoyer un fichier (image ou vidéo) vers LiveChat</p>
      </div>
      <div
        class="flex justify-center items-center border-2 border-dashed border-gray-300 w-full h-72 text-center rounded-md"
        :class="{ 'border-[#605dff] bg-blue-50': isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop="handleDrop"
      >
        <input
          type="file"
          class="hidden"
          id="fileInput"
          @change="handleFileChange"
          accept="image/*,video/*"
        />

        <label v-if="!isDragging" for="fileInput" class="cursor-pointer">
          <div class="flex items-center justify-center text-gray-500 space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-download"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            <p>Glissez et déposez un fichier ici</p>
          </div>
          <p class="text-[#605dff] font-semibold mt-2">
            ou cliquez pour parcourir
          </p>
          <p v-if="file" class="mt-4 text-green-600">
            Fichier sélectionné : {{ file.name }}
          </p>
        </label>

        <p v-else class="text-[#605dff] font-semibold pointer-events-none">
          Relâchez pour déposer
        </p>
      </div>

      <Input v-model="caption" placeholder="Légende" class="w-full" />
      <div class="space-x-4">
        <input
          v-model="duration"
          placeholder="Durée"
          class="input w-32"
          type="number"
        />
        <span
          >secondes (pour une vidéo, 0s correspond à sa durée complète)</span
        >
      </div>
      <Button :disabled="!file" @click="upload">Envoyer</Button>
    </div>

    <div class="mt-8">
      <div class="mb-8">
        <h1 class="text-2xl font-bold mb-2">Aperçu du média</h1>
        <p>
          Si l'aperçu ne charge pas correctement, il y a de grandes chances que
          le média ne s'affiche pas sur les clients
        </p>
      </div>
      <div class="flex flex-col mt-8 justify-center items-center">
        <div v-if="file">
          <img
            v-if="file.type.startsWith('image')"
            :src="fileUrl!"
            class="mt-2 max-w-xs rounded-md shadow-lg"
          />
          <video
            v-if="file.type.startsWith('video')"
            :src="fileUrl!"
            class="mt-2 max-w-2xs rounded-md shadow-lg"
            controls
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useToast } from "vue-toast-notification";
import axios from "axios";
import Input from "../ui/Input.vue";
import Button from "../ui/Button.vue";

const server: string = import.meta.env.VITE_SERVER_URL as string;

const toast = useToast();

const file = ref<File | null>(null);
const fileUrl = ref<string | null>(null);
const isDragging = ref<boolean>(false);

const caption = ref<string>("");
const duration = ref<number>(5);

const handlePaste = async (event: ClipboardEvent) => {
  const clipboardItems = event.clipboardData?.items || [];

  for (const item of clipboardItems) {
    if (item.type.startsWith("image") || item.type.startsWith("video")) {
      const blob: File | null = item.getAsFile();
      if (!blob) return;
      file.value = blob;
      fileUrl.value = URL.createObjectURL(blob);
      break;
    }
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;

  if (!event.dataTransfer?.files.length) return;

  const droppedFile = event.dataTransfer.files[0];
  if (droppedFile) {
    processFile(droppedFile);
  }
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return;

  const selectedFile = target.files[0];
  processFile(selectedFile);
};

const processFile = (selectedFile: File) => {
  // Vérifier si c'est une image ou une vidéo
  if (
    !selectedFile.type.startsWith("image") &&
    !selectedFile.type.startsWith("video")
  ) {
    alert("Seules les images et vidéos sont acceptées !");
    return;
  }

  file.value = selectedFile;
  fileUrl.value = URL.createObjectURL(selectedFile);
};

// upload the image to the server
const upload = async () => {
  if (!file.value) return;

  const formData = new FormData();
  formData.append("src", file.value as Blob);
  formData.append("caption", caption.value);
  // send duration in milliseconds
  formData.append("duration", (duration.value * 1000).toString());

  if (
    !file.value.type.startsWith("image") &&
    !file.value.type.startsWith("video")
  ) {
    toast.error("Seules les images et vidéos sont acceptées !", {
      position: "top",
      duration: 3000,
    });
    return;
  }

  if (file.value.type.startsWith("image")) {
    try {
      await axios.post(`${server}/api/upload/image-by-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Image envoyée avec succès !", {
        position: "top",
        duration: 3000,
      });
    } catch (err) {
      toast.error("Erreur lors de l'envoi de l'image", {
        position: "top",
        duration: 3000,
      });
      console.error(err);
    }
  } else {
    try {
      await axios.post(`${server}/api/upload/video-by-file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
  }
};

onMounted(() => {
  window.addEventListener("paste", handlePaste);
});

onUnmounted(() => {
  window.removeEventListener("paste", handlePaste);
});
</script>

<style></style>
