<template>
  <input
    type="text"
    :placeholder="placeholder"
    :value="modelValue"
    class="input"
    @input="updateValue"
  />
</template>

<script lang="ts" setup>
defineProps({
  placeholder: {
    type: String,
    default: "",
  },
  modelValue: {
    type: String,
  },
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<style></style>
