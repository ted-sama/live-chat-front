<template>
  <input type="file" class="file-input" :accept="accept" />
</template>

<script lang="ts" setup>
defineProps({
  accept: {
    type: String,
    default: "",
  },
});
</script>

<style></style>
