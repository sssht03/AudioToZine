<template>
  <template v-for="(url, index) in props.imageUrls" :key="index">
    <img :src="url" />
  </template>
</template>

<script lang="ts" setup>

const props = defineProps<{
  imageUrls: string[];
}>();
</script>
