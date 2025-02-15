<template>
  <div role="tablist" class="tabs tabs-border">
    <div
      v-for="(tab, index) in tabs"
      :key="index"
      :class="{ 'tab tab-active': isActive(tab), tab: !isActive(tab) }"
      role="tab"
      @click="changeTab(tab)"
    >
      {{ tab }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  tabs: {
    type: Array as () => string[],
    required: true,
  },
});

const emit = defineEmits(["currentTab"]);

const activeTab = ref<string>('');

const changeTab = (tab: string) => {
  activeTab.value = tab;
  emit("currentTab", activeTab.value);
};

const isActive = (tab: string) => {
  return activeTab.value === tab;
};

onMounted(() => {
  changeTab(props.tabs[0]);
});
</script>

<style></style>
