<template>
  <div>
    <h1 class="text-2xl">Envoyer une image par fichier</h1>
    <div class="flex flex-col gap-y-4 mt-6">
      <FileInput
        ref="file-input"
        class="w-full"
        accept="image/jpeg, image/png, image/gif"
        @change="preview"
      />
      <Input v-model="caption" placeholder="Légende" class="w-full" />
      <Button :disabled="!file" @click="upload">Envoyer</Button>
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
import FileInput from "../ui/FileInput.vue";
import Input from "../ui/Input.vue";
import Button from "../ui/Button.vue";

const server: string = import.meta.env.VITE_SERVER_URL as string;

const file = ref<File | null>(null);
const caption = ref<string>("");

// preview the image on the page
const preview = (e: any) => {
  file.value = e.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.querySelector("img");
      if (img) {
        img.setAttribute("src", e.target?.result as string);
      }
    };
    reader.readAsDataURL(file.value as Blob);
  }
};

// upload the image to the server
const upload = async () => {
  const formData = new FormData();
  formData.append("src", file.value as Blob);
  formData.append("caption", caption.value);

  try {
    await axios.post(`${server}/api/upload/image-by-file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    console.error(err);
  }
};
</script>

<style></style>
