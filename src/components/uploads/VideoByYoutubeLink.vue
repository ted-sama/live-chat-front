<template>
  <div>
    <h1 class="text-2xl">Envoyer une vidéo par lien YouTube</h1>
    <div class="flex flex-col gap-y-4 mt-6">
      <Input
        v-model="link"
        placeholder="Lien"
        class="w-full"
        @input="preview"
      />
      <Input v-model="caption" placeholder="Légende" class="w-full" />
      <div class="space-x-4">
        <input v-model="duration" placeholder="Durée" class="input w-32" type="number" />
        <span>secondes (0 correspond à la durée initiale de la vidéo)</span>
      </div>
      <Button :disabled="!link" @click="upload">Envoyer</Button>
    </div>
    <div class="flex flex-col mt-8 justify-center items-center">
      <h2 class="text-xl">Aperçu de la vidéo</h2>
      <span>Si l'aperçu ne charge pas correctement, la vidéo ne s'affichera sûrement pas sur les clients (sauf .mov)</span>
      <iframe
        id="ytplayer"
        src=""
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
import { ref } from "vue";
import { useToast } from "vue-toast-notification";
import axios from "axios";
import Input from "../ui/Input.vue";
import Button from "../ui/Button.vue";

const server: string = import.meta.env.VITE_SERVER_URL as string;

const toast = useToast();

const link = ref<string>("");
const caption = ref<string>("");
const duration = ref<number>(5);

// preview the video on the page with youtube embed
const preview = () => {
  if (!link.value) return;

  setTimeout(() => {
    const videoId =
      link.value.split("v=")[1] || link.value.split("youtu.be/")[1];
    const embedLink: string = `https://www.youtube.com/embed/${videoId}`;
    const player = document.getElementById("ytplayer") as HTMLIFrameElement;
    player.src = embedLink;
  }, 1000);
};

// upload the video to the server
const upload = async () => {
  if (!link.value) return;

  // json form
  const data = {
    src: link.value,
    caption: caption.value,
    // send duration in milliseconds
    duration: duration.value * 1000,
  };

  try {
    await axios.post(`${server}/api/upload/video-by-link/youtube`, data);
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
};
</script>

<style></style>
