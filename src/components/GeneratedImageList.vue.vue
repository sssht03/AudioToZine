<template>
  <template v-for="url in props.imageUrls" :key="index">
    <img :src="url" />
  </template>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps<{
  imageUrls: string[];
}>();
</script>
