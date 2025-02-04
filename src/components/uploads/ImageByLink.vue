<template>
  <div>
    <h1 class="text-2xl">Envoyer une image par lien</h1>
    <div class="flex flex-col gap-y-4 mt-6">
      <Input
        v-model="link"
        placeholder="Lien"
        class="w-full"
        @input="preview"
      />
      <Input v-model="caption" placeholder="Légende" class="w-full" />
      <Button :disabled="!link" @click="upload">Envoyer</Button>
    </div>
    <div class="flex flex-col mt-8 justify-center items-center">
      <h2 class="text-xl">Aperçu de l'image</h2>
      <img src="" class="mt-4 h-96" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import Input from "../ui/Input.vue";
import Button from "../ui/Button.vue";

const server: string = import.meta.env.VITE_SERVER_URL as string;

const link = ref<string>("");
const caption = ref<string>("");

// preview the image on the page
const preview = () => {
  if (!link.value) return;

  setTimeout(() => {
    const img = document.querySelector("img");
    if (img) {
      img.setAttribute("src", link.value);
    }
  }, 1000);
};

// upload the image to the server
const upload = async () => {
  // json form
  const data = {
    src: link.value,
    caption: caption.value,
  };

  try {
    await axios.post(`${server}/api/upload/image-by-link`, data);
  } catch (err) {
    console.error(err);
  }
};
</script>

<style></style>
