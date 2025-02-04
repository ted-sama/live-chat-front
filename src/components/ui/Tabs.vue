<template>
  <div role="tablist" class="tabs tabs-border">
    <div
      v-for="(tab, index) in tabs"
      :key="index"
      :class="{ 'tab tab-active': isActive(index), tab: !isActive(index) }"
      role="tab"
      @click="changeTab(index)"
    >
      {{ tab }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

defineProps({
  tabs: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["currentTab"]);

const activeTab = ref(0);

const changeTab = (index: number) => {
  activeTab.value = index;
  emit("currentTab", activeTab.value);
};

const isActive = (index: number) => {
  return activeTab.value === index;
};
</script>

<style></style>
