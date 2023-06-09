<template>
  <div class="w-full">
    <h1 class="text-5xl font-bold">AudioToZine</h1>
    <p>Powered by OpenAI</p>

    <AudioToText @transcribed-text="transcribedTextHandler" />
    <TextToZine :transcribedText="transcribedText" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AudioToText from './AudioToText.vue';
import TextToZine from './TextToZine.vue';

const transcribedText = ref('');
const transcribedTextHandler = (value: string): void => {
  transcribedText.value = value;
};
</script>

<style scoped></style>
